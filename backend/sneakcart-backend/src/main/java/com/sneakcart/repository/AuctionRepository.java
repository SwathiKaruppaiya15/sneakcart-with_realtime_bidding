package com.sneakcart.repository;

import com.sneakcart.entity.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuctionRepository extends JpaRepository<Auction, Long> {
    List<Auction> findByStatus(Auction.AuctionStatus status);
}
