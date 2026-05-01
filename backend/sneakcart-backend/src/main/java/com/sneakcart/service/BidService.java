package com.sneakcart.service;

import com.sneakcart.dto.request.BidRequest;
import com.sneakcart.entity.Auction;
import com.sneakcart.entity.Bid;
import com.sneakcart.entity.User;
import com.sneakcart.exception.BadRequestException;
import com.sneakcart.exception.ResourceNotFoundException;
import com.sneakcart.repository.AuctionRepository;
import com.sneakcart.repository.BidRepository;
import com.sneakcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository     bidRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository    userRepository;

    @Transactional
    public Bid placeBid(Long auctionId, BidRequest req) {
        // 1. Validate auction exists and is still active
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found: " + auctionId));

        if (auction.getStatus() != Auction.AuctionStatus.ACTIVE) {
            throw new BadRequestException("Auction is not active");
        }
        if (LocalDateTime.now().isAfter(auction.getEndTime())) {
            throw new BadRequestException("Auction has ended");
        }

        // 2. Validate user exists
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId()));

        // 3. Validate bid > current highest bid
        double currentHighest = bidRepository.findHighestBid(auctionId)
                .map(Bid::getAmount)
                .orElse(auction.getBasePrice());

        if (req.getAmount() <= currentHighest) {
            throw new BadRequestException(
                "Bid must be higher than current highest bid of ₹" + currentHighest
            );
        }

        // 4. Save bid to PostgreSQL
        Bid bid = Bid.builder()
                .auction(auction)
                .user(user)
                .amount(req.getAmount())
                .timestamp(LocalDateTime.now())
                .build();

        return bidRepository.save(bid);
    }

    public double getHighestBid(Long auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found: " + auctionId));
        return bidRepository.findHighestBid(auctionId)
                .map(Bid::getAmount)
                .orElse(auction.getBasePrice());
    }

    public List<Bid> getLeaderboard(Long auctionId) {
        return bidRepository.findTop3(auctionId);
    }

    public List<Bid> getAllBids(Long auctionId) {
        return bidRepository.findByAuctionIdOrderByAmountDesc(auctionId);
    }
}
