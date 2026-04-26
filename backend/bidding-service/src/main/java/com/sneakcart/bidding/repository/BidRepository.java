package com.sneakcart.bidding.repository;

import com.sneakcart.bidding.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByAuctionIdOrderByAmountDesc(String auctionId);

    @Query("SELECT b FROM Bid b WHERE b.auctionId = :auctionId ORDER BY b.amount DESC LIMIT 1")
    Optional<Bid> findHighestBid(@Param("auctionId") String auctionId);

    @Query("SELECT b FROM Bid b WHERE b.auctionId = :auctionId ORDER BY b.amount DESC LIMIT 3")
    List<Bid> findTop3(@Param("auctionId") String auctionId);
}
