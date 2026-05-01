package com.sneakcart.service;

import com.sneakcart.dto.request.ProductRequest;
import com.sneakcart.entity.Product;
import com.sneakcart.exception.ResourceNotFoundException;
import com.sneakcart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Product add(ProductRequest req) {
        Product product = Product.builder()
                .name(req.getName())
                .brand(req.getBrand())
                .price(req.getPrice())
                .color(req.getColor())
                .sizes(req.getSizes())
                .badge(req.getBadge())
                .imageUrl(req.getImageUrl())
                .isAuction(req.getIsAuction() != null ? req.getIsAuction() : false)
                .build();
        return productRepository.save(product);
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    public List<Product> filter(String color, Double minPrice, Double maxPrice) {
        return productRepository.filter(color, minPrice, maxPrice);
    }

    public List<Product> getAuctionProducts() {
        return productRepository.findByIsAuction(true);
    }

    public Product update(Long id, ProductRequest req) {
        Product product = getById(id);
        product.setName(req.getName());
        product.setBrand(req.getBrand());
        product.setPrice(req.getPrice());
        product.setColor(req.getColor());
        product.setSizes(req.getSizes());
        product.setBadge(req.getBadge());
        product.setImageUrl(req.getImageUrl());
        product.setIsAuction(req.getIsAuction() != null ? req.getIsAuction() : false);
        return productRepository.save(product);
    }

    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }
}
