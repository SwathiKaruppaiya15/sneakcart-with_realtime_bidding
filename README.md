# 👟 SneakCart — Sneaker Marketplace

A full-stack sneaker marketplace with live auctions, cart, wishlist, and order management.

**Frontend:** React + Vite + plain CSS  
**Backend:** Spring Boot microservices  
**Database:** PostgreSQL  
**Cache:** Redis  
**Messaging:** Kafka  
**Real-time:** WebSocket (STOMP)

---

## Project Structure

```
sneaker-marketplace/
├── frontend/sneaker-marketplace/   # React app (Vite)
├── backend/
│   ├── api-gateway/                # Spring Cloud Gateway (port 8080)
│   ├── auth-service/               # JWT auth (port 8081)
│   ├── product-service/            # Product CRUD (port 8082)
│   ├── order-service/              # Order management (port 8083)
│   └── bidding-service/            # Live auction bidding (port 8084)
├── infra/
│   └── init.sql                    # PostgreSQL database init
├── docker-compose.yml
└── SYSTEM_DESIGN.md
```

---

## Features

### Frontend
| Page | Description |
|------|-------------|
| Home | Hero banner, category grid, 8 featured products |
| Products | 25 shoes with price range + color filters |
| Product Detail | Size selection, Add to Cart, Buy Now, recommended shoes |
| Trends | 15 live auction cards with countdown timers |
| Auction | Real-time bidding, leaderboard, bid validation |
| Cart | Qty controls, INR pricing, localStorage persistence |
| Wishlist | Save/remove items, localStorage persistence |
| Checkout | 4-step flow: Address → Payment (UPI/COD) → Preview → Confirm |
| Orders | Order history with address, payment method, recommendations |

### Backend
- JWT authentication with BCrypt password hashing
- Product filtering by price range and color
- Order placement and history
- Real-time bid updates via WebSocket
- Redis atomic bid validation (race condition prevention)
- Kafka async bid persistence with DLQ + 3x retry
- Redis fallback to DB on failure

---

## Quick Start

### Option 1 — Docker (recommended)

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Gateway | http://localhost:8080 |
| Auth Service | http://localhost:8081 |
| Product Service | http://localhost:8082 |
| Order Service | http://localhost:8083 |
| Bidding Service | http://localhost:8084 |

---

### Option 2 — Local Development

**Prerequisites:** Node 20+, Java 17+, Maven, PostgreSQL, Redis, Kafka

**1. Start infrastructure**
```bash
docker-compose up postgres redis kafka zookeeper -d
```

**2. Run backend services** (each in a separate terminal)
```bash
cd backend/auth-service    && mvn spring-boot:run
cd backend/product-service && mvn spring-boot:run
cd backend/order-service   && mvn spring-boot:run
cd backend/bidding-service && mvn spring-boot:run
cd backend/api-gateway     && mvn spring-boot:run
```

**3. Run frontend**
```bash
cd frontend/sneaker-marketplace
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/register` | `{ name, email, password }` |
| POST | `/login` | `{ email, password }` |

### Products — `/api/products`
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/` | All products |
| GET | `/filter?color=&minPrice=&maxPrice=` | Filtered |
| GET | `/auction` | Auction-only products |
| POST | `/` | Add product |
| PUT | `/:id` | Update product |
| DELETE | `/:id` | Delete product |

### Orders — `/api/orders`
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/` | Place order |
| GET | `/user/:userId` | Order history |

### Bids — `/api/bids`
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/` | Place bid |
| GET | `/:auctionId/highest` | Current highest bid |
| GET | `/:auctionId/leaderboard` | Top 3 bidders |

### WebSocket
```
Endpoint:  ws://localhost:8084/ws  (SockJS)
Subscribe: /topic/auction/:auctionId
Message:   { auctionId, userId, userName, amount }
```

---

## Environment Variables

Create a `.env` file for production (see `.env.example`):

```env
POSTGRES_PASSWORD=your_strong_password
JWT_SECRET=your_256_bit_secret_key
REDIS_HOST=redis
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, plain CSS |
| State | React Context + localStorage |
| Backend | Spring Boot 3.2, Spring Cloud Gateway |
| Auth | JWT (jjwt), BCrypt |
| Database | PostgreSQL 16 (JPA / Hibernate) |
| Cache | Redis 7 |
| Messaging | Apache Kafka |
| Real-time | WebSocket (STOMP + SockJS) |
| Container | Docker + Docker Compose |
| Web Server | Nginx (frontend production) |

---

## System Design

See [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) for:
- Architecture diagram
- Data flow (purchase + auction)
- Redis concurrency model
- Failure handling table
- Scaling strategy

---

## Screenshots

> Add screenshots here after running the project locally.

---

## License

MIT
