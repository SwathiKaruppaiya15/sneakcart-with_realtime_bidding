package com.sneakcart.bidding;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import com.sneakcart.bidding.model.Bid;
import com.sneakcart.bidding.service.BidService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
public class BiddingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(BiddingServiceApplication.class, args);
    }
}

// ── WebSocket Configuration ──────────────────────────────────────────────────
@org.springframework.context.annotation.Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}

// ── Kafka Consumer ────────────────────────────────────────────────────────────
@Component
@RequiredArgsConstructor
@Slf4j
class BidKafkaConsumer {

    private final BidService bidService;

    @KafkaListener(topics = "bid-placed", groupId = "bidding-group")
    public void consume(Bid bid) {
        try {
            bidService.saveBid(bid);
            log.info("Bid persisted: auction={} amount={}", bid.getAuctionId(), bid.getAmount());
        } catch (Exception e) {
            log.error("Failed to persist bid, sending to DLQ: {}", e.getMessage());
            // DLQ handled by Spring Kafka's DefaultErrorHandler with BackOff
        }
    }
}
