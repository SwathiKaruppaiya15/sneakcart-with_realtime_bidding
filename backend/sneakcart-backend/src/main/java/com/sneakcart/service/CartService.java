package com.sneakcart.service;

import com.sneakcart.dto.request.CartItemRequest;
import com.sneakcart.entity.Cart;
import com.sneakcart.entity.CartItem;
import com.sneakcart.entity.Product;
import com.sneakcart.entity.User;
import com.sneakcart.exception.BadRequestException;
import com.sneakcart.exception.ResourceNotFoundException;
import com.sneakcart.repository.CartItemRepository;
import com.sneakcart.repository.CartRepository;
import com.sneakcart.repository.ProductRepository;
import com.sneakcart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository     cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository     userRepository;
    private final ProductRepository  productRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       UserRepository userRepository,
                       ProductRepository productRepository) {
        this.cartRepository     = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository     = userRepository;
        this.productRepository  = productRepository;
    }

    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setItems(new ArrayList<>());
            return cartRepository.save(newCart);
        });
    }

    @Transactional
    public Cart addItem(Long userId, CartItemRequest req) {
        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + req.getProductId()));

        Optional<CartItem> existing = cartItemRepository
                .findByCartIdAndProductIdAndSelectedSize(
                    cart.getId(), req.getProductId(), req.getSelectedSize());

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + req.getQuantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(req.getQuantity());
            newItem.setSelectedSize(req.getSelectedSize());
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeItem(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to this user's cart");
        }

        cart.getItems().remove(item);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateQuantity(Long userId, Long cartItemId, int quantity) {
        if (quantity < 1) throw new BadRequestException("Quantity must be at least 1");

        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));

        item.setQuantity(quantity);
        cartRepository.save(cart);
        return cart;
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
