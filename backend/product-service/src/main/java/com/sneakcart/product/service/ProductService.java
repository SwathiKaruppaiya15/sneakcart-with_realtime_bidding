package com.sneakcart.product.service;

import com.sneakcart.product.model.Product;
import com.sneakcart.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repo;

    public Product add(Product product) {
        return repo.save(product);
    }

    public List<Product> getAll() {
        return repo.findAll();
    }

    public Product getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    public List<Product> filter(String color, Long minPrice, Long maxPrice) {
        return repo.filter(color, minPrice, maxPrice);
    }

    public List<Product> getAuctionProducts() {
        return repo.findByIsAuction(true);
    }

    public Product update(Long id, Product updated) {
        Product existing = getById(id);
        existing.setName(updated.getName());
        existing.setBrand(updated.getBrand());
        existing.setPrice(updated.getPrice());
        existing.setColor(updated.getColor());
        existing.setSizes(updated.getSizes());
        existing.setBadge(updated.getBadge());
        existing.setIsAuction(updated.getIsAuction());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
