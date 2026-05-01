package com.sneakcart.controller;

import com.sneakcart.dto.request.BidRequest;
import com.sneakcart.entity.Bid;
import com.sneakcart.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    // POST /api/auctions/{auctionId}/bids
    @PostMapping("/{auctionId}/bids")
    public ResponseEntity<Bid> placeBid(@PathVariable Long auctionId,
                                        @Valid @RequestBody BidRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bidService.placeBid(auctionId, req));
    }

    // GET /api/auctions/{auctionId}/bids/highest
    @GetMapping("/{auctionId}/bids/highest")
    public ResponseEntity<Map<String, Double>> getHighest(@PathVariable Long auctionId) {
        return ResponseEntity.ok(Map.of("highestBid", bidService.getHighestBid(auctionId)));
    }

    // GET /api/auctions/{auctionId}/bids/leaderboard
    @GetMapping("/{auctionId}/bids/leaderboard")
    public ResponseEntity<List<Bid>> getLeaderboard(@PathVariable Long auctionId) {
        return ResponseEntity.ok(bidService.getLeaderboard(auctionId));
    }

    // GET /api/auctions/{auctionId}/bids
    @GetMapping("/{auctionId}/bids")
    public ResponseEntity<List<Bid>> getAllBids(@PathVariable Long auctionId) {
        return ResponseEntity.ok(bidService.getAllBids(auctionId));
    }
}
