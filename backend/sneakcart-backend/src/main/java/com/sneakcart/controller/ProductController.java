package com.sneakcart.controller;

import com.sneakcart.dto.request.ProductRequest;
import com.sneakcart.entity.Product;
import com.sneakcart.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filter(
            @RequestParam(required = false) String color,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        return ResponseEntity.ok(productService.filter(color, minPrice, maxPrice));
    }

    @GetMapping("/auction")
    public ResponseEntity<List<Product>> getAuctions() {
        return ResponseEntity.ok(productService.getAuctionProducts());
    }

    @PostMapping
    public ResponseEntity<Product> add(@Valid @RequestBody ProductRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.add(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id,
                                          @Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(productService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
