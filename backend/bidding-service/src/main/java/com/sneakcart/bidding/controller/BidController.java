package com.sneakcart.bidding.controller;

import com.sneakcart.bidding.model.Bid;
import com.sneakcart.bidding.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BidController {

    private final BidService service;

    @PostMapping
    public ResponseEntity<?> placeBid(@RequestBody Bid bid) {
        try {
            return ResponseEntity.ok(service.placeBid(bid));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{auctionId}/highest")
    public ResponseEntity<Map<String, Long>> getHighest(@PathVariable String auctionId) {
        return ResponseEntity.ok(Map.of("highestBid", service.getHighestBid(auctionId)));
    }

    @GetMapping("/{auctionId}/leaderboard")
    public ResponseEntity<List<Bid>> leaderboard(@PathVariable String auctionId) {
        return ResponseEntity.ok(service.getLeaderboard(auctionId));
    }

    @GetMapping("/{auctionId}/all")
    public ResponseEntity<List<Bid>> all(@PathVariable String auctionId) {
        return ResponseEntity.ok(service.getAllBids(auctionId));
    }
}
