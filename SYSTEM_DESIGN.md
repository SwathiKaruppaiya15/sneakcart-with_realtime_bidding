# SneakCart — System Design

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                           │
│  Home │ Products │ Trends (Auctions) │ Cart │ Checkout │ Orders │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway  :8080                           │
│         Spring Cloud Gateway — routing + CORS                   │
└──────┬──────────┬──────────┬──────────┬──────────────────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
  Auth :8081  Product :8082  Order :8083  Bidding :8084
  JWT          PostgreSQL    PostgreSQL   PostgreSQL
  BCrypt                                 + Redis
                                         + Kafka
                                         + WebSocket
```

---

## Services

| Service         | Port | DB                    | Responsibilities                        |
|-----------------|------|-----------------------|-----------------------------------------|
| API Gateway     | 8080 | —                     | Route, CORS, load balance               |
| Auth Service    | 8081 | sneakcart_auth        | Register, Login, JWT issue/validate     |
| Product Service | 8082 | sneakcart_products    | CRUD products, filter by price/color    |
| Order Service   | 8083 | sneakcart_orders      | Place order, order history              |
| Bidding Service | 8084 | sneakcart_bids        | Place bid, leaderboard, real-time WS    |

---

## Data Flow

### Regular Purchase
```
User → Cart (localStorage) → Checkout (4 steps) → POST /api/orders
     → Order Service saves to PostgreSQL
     → Response: order confirmation
```

### Auction Bid
```
User → Auction Page → Place Bid
     → POST /api/bids
     → Bidding Service:
         1. Read current highest from Redis (O(1))
         2. Validate bid > current
         3. Atomic write to Redis
         4. Publish to Kafka topic "bid-placed"
         5. Broadcast via WebSocket /topic/auction/:id
     → Kafka Consumer:
         1. Consume "bid-placed"
         2. Persist Bid to PostgreSQL
         3. On failure: retry 3x → DLQ "bid-placed.DLT"
     → All connected clients receive real-time update
```

---

## Concurrency Handling (Redis)

The bidding service uses Redis as the single source of truth for the current highest bid.

```
Thread A: GET auction:highest:A1  → 31500
Thread B: GET auction:highest:A1  → 31500

Thread A: bid=32000 > 31500 ✓  → SET auction:highest:A1 32000
Thread B: bid=31800 > 31500 ✓  → SET auction:highest:A1 31800  ← RACE!
```

**Solution — Lua atomic script (production upgrade):**
```lua
local current = redis.call('GET', KEYS[1])
if current == false or tonumber(ARGV[1]) > tonumber(current) then
  redis.call('SET', KEYS[1], ARGV[1])
  return 1
end
return 0
```
This executes atomically in Redis, eliminating the race condition entirely.

---

## Failure Handling

| Failure              | Detection                        | Recovery                                      |
|----------------------|----------------------------------|-----------------------------------------------|
| Redis down           | Connection exception in BidService | Fall back to DB query for highest bid        |
| Kafka broker down    | KafkaProducerException           | Spring Kafka retries with exponential backoff |
| Bid persist fails    | Consumer exception               | Retry 3× (2s interval) → publish to DLT      |
| WebSocket disconnect | STOMP onDisconnect callback      | Auto-reconnect every 3s (client-side)         |
| Service crash        | Docker healthcheck               | Docker restarts container automatically       |
| DB connection lost   | HikariCP timeout                 | HikariCP connection pool retries              |

---

## Scaling Strategy

### Horizontal Scaling
- All services are stateless (JWT auth, Redis for bid state)
- Scale any service independently: `docker-compose up --scale product-service=3`
- API Gateway load-balances via Spring Cloud LoadBalancer

### Kafka Partitioning
- `bid-placed` topic has 3 partitions
- Partition key = `auctionId` → all bids for same auction go to same partition → ordered processing

### Redis Cluster (production)
- Switch to Redis Cluster for HA
- Use Redis Sentinel for automatic failover

### Database
- Read replicas for Product Service (high read traffic)
- Connection pooling via HikariCP (default in Spring Boot)
- Index on `bids.auction_id` and `bids.amount` for leaderboard queries

### CDN
- Static assets (React build) served via CloudFront / Nginx
- Product images served from S3 with CDN caching

---

## Deployment Steps (Prompt 21)

### Prerequisites
```bash
# Install Docker Desktop
# Install Java 17, Maven, Node 20
```

### Local Development
```bash
# Start infrastructure
docker-compose up postgres redis kafka zookeeper -d

# Backend (run each in separate terminal)
cd backend/auth-service    && mvn spring-boot:run
cd backend/product-service && mvn spring-boot:run
cd backend/order-service   && mvn spring-boot:run
cd backend/bidding-service && mvn spring-boot:run
cd backend/api-gateway     && mvn spring-boot:run

# Frontend
cd frontend/sneaker-marketplace && npm run dev
```

### Production (Docker Compose)
```bash
# Build and start everything
docker-compose up --build -d

# Check logs
docker-compose logs -f bidding-service

# Scale a service
docker-compose up --scale product-service=3 -d

# Stop all
docker-compose down
```

### Environment Variables (production)
```env
POSTGRES_PASSWORD=<strong-password>
JWT_SECRET=<256-bit-random-string>
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
REDIS_HOST=redis
```

---

## API Reference

### Auth
| Method | Path                  | Body                          | Response        |
|--------|-----------------------|-------------------------------|-----------------|
| POST   | /api/auth/register    | {name, email, password}       | {token}         |
| POST   | /api/auth/login       | {email, password}             | {token}         |

### Products
| Method | Path                        | Params / Body                 | Response        |
|--------|-----------------------------|-------------------------------|-----------------|
| GET    | /api/products               | —                             | Product[]       |
| GET    | /api/products/filter        | ?color=&minPrice=&maxPrice=   | Product[]       |
| GET    | /api/products/auction       | —                             | Product[]       |
| POST   | /api/products               | Product body                  | Product         |

### Orders
| Method | Path                        | Body                          | Response        |
|--------|-----------------------------|-------------------------------|-----------------|
| POST   | /api/orders                 | Order body                    | Order           |
| GET    | /api/orders/user/:userId    | —                             | Order[]         |

### Bids
| Method | Path                          | Body                          | Response        |
|--------|-------------------------------|-------------------------------|-----------------|
| POST   | /api/bids                     | {auctionId, userId, amount}   | Bid             |
| GET    | /api/bids/:auctionId/highest  | —                             | {highestBid}    |
| GET    | /api/bids/:auctionId/leaderboard | —                          | Bid[3]          |

### WebSocket
```
Connect:    ws://localhost:8084/ws  (SockJS)
Subscribe:  /topic/auction/:auctionId
Message:    { auctionId, userId, userName, amount }
```
