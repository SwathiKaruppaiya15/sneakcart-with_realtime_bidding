package com.sneakcart.bidding.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bids")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String auctionId;

    @Column(nullable = false)
    private String userId;

    private String userName;

    @Column(nullable = false)
    private Long amount;

    private LocalDateTime placedAt = LocalDateTime.now();
}
