package com.sneakcart.service;

import com.sneakcart.entity.Product;
import com.sneakcart.entity.User;
import com.sneakcart.entity.Wishlist;
import com.sneakcart.exception.BadRequestException;
import com.sneakcart.exception.ResourceNotFoundException;
import com.sneakcart.repository.ProductRepository;
import com.sneakcart.repository.UserRepository;
import com.sneakcart.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository     userRepository;
    private final ProductRepository  productRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository     = userRepository;
        this.productRepository  = productRepository;
    }

    public List<Wishlist> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @Transactional
    public Wishlist addToWishlist(Long userId, Long productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new BadRequestException("Product already in wishlist");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        Wishlist entry = new Wishlist();
        entry.setUser(user);
        entry.setProduct(product);
        return wishlistRepository.save(entry);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new ResourceNotFoundException("Product not in wishlist");
        }
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }
}
