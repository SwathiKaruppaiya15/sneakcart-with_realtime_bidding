package com.sneakcart.bidding.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConfig {

    // Main topic
    @Bean
    public NewTopic bidPlacedTopic() {
        return TopicBuilder.name("bid-placed")
                .partitions(3)
                .replicas(1)
                .build();
    }

    // Dead Letter Queue topic
    @Bean
    public NewTopic bidDlqTopic() {
        return TopicBuilder.name("bid-placed.DLT")
                .partitions(1)
                .replicas(1)
                .build();
    }

    /**
     * Retry 3 times with 2s interval, then publish to DLQ.
     */
    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> kafkaTemplate) {
        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(kafkaTemplate);
        FixedBackOff backOff = new FixedBackOff(2000L, 3L);
        return new DefaultErrorHandler(recoverer, backOff);
    }
}
