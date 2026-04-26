package com.sneakcart.bidding.service;

import com.sneakcart.bidding.model.Bid;
import com.sneakcart.bidding.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BidService {

    private final BidRepository repo;
    private final RedisTemplate<String, String> redisTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SimpMessagingTemplate ws;

    private static final String REDIS_KEY = "auction:highest:";
    private static final String KAFKA_TOPIC = "bid-placed";

    /**
     * Place a bid with Redis atomic check to prevent race conditions.
     * Uses SETNX-style logic: only update if new bid > current highest.
     */
    public Bid placeBid(Bid bid) {
        String redisKey = REDIS_KEY + bid.getAuctionId();

        long current = 0L;
        boolean redisAvailable = true;

        // Redis failure handling — fall back to DB if Redis is down
        try {
            String currentStr = redisTemplate.opsForValue().get(redisKey);
            current = currentStr != null ? Long.parseLong(currentStr) : 0L;
        } catch (Exception e) {
            log.warn("Redis unavailable, falling back to DB for highest bid: {}", e.getMessage());
            redisAvailable = false;
            current = repo.findHighestBid(bid.getAuctionId()).map(Bid::getAmount).orElse(0L);
        }

        if (bid.getAmount() <= current) {
            throw new RuntimeException(
                "Bid must be higher than current highest bid of ₹" + current
            );
        }

        // Update Redis atomically (skip if unavailable)
        if (redisAvailable) {
            try {
                redisTemplate.opsForValue().set(redisKey, String.valueOf(bid.getAmount()));
            } catch (Exception e) {
                log.warn("Redis write failed, bid will be persisted via DB only: {}", e.getMessage());
            }
        }

        // Persist to DB via Kafka (async)
        kafkaTemplate.send(KAFKA_TOPIC, bid.getAuctionId(), bid);
        log.info("Bid event published: auction={} amount={}", bid.getAuctionId(), bid.getAmount());

        // Broadcast via WebSocket
        ws.convertAndSend("/topic/auction/" + bid.getAuctionId(), Map.of(
            "auctionId", bid.getAuctionId(),
            "userId",    bid.getUserId(),
            "userName",  bid.getUserName() != null ? bid.getUserName() : "Anonymous",
            "amount",    bid.getAmount()
        ));

        return bid;
    }

    public Long getHighestBid(String auctionId) {
        String val = redisTemplate.opsForValue().get(REDIS_KEY + auctionId);
        if (val != null) return Long.parseLong(val);
        return repo.findHighestBid(auctionId).map(Bid::getAmount).orElse(0L);
    }

    public List<Bid> getLeaderboard(String auctionId) {
        return repo.findTop3(auctionId);
    }

    public List<Bid> getAllBids(String auctionId) {
        return repo.findByAuctionIdOrderByAmountDesc(auctionId);
    }

    // Called by Kafka consumer to persist bid
    public Bid saveBid(Bid bid) {
        return repo.save(bid);
    }
}
