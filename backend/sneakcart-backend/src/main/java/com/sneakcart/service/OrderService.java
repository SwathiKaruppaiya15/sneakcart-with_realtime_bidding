package com.sneakcart.service;

import com.sneakcart.dto.request.OrderRequest;
import com.sneakcart.entity.*;
import com.sneakcart.exception.BadRequestException;
import com.sneakcart.exception.ResourceNotFoundException;
import com.sneakcart.repository.CartRepository;
import com.sneakcart.repository.OrderRepository;
import com.sneakcart.repository.ProductRepository;
import com.sneakcart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository   orderRepository;
    private final UserRepository    userRepository;
    private final CartRepository    cartRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        CartRepository cartRepository,
                        ProductRepository productRepository) {
        this.orderRepository   = orderRepository;
        this.userRepository    = userRepository;
        this.cartRepository    = cartRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order placeOrder(OrderRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId()));

        Cart cart = cartRepository.findByUserId(req.getUserId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty — add items before placing order");
        }

        // ── STOCK VALIDATION (check all before deducting any) ──────────────
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException(
                    "Insufficient stock for '" + product.getName() +
                    "'. Available: " + product.getStock() +
                    ", Requested: " + cartItem.getQuantity()
                );
            }
        }

        // ── BUILD ORDER ─────────────────────────────────────────────────────
        Order order = new Order();
        order.setUser(user);
        order.setAddressLine(req.getAddressLine());
        order.setCity(req.getCity());
        order.setPinCode(req.getPinCode());
        order.setPhone(req.getPhone());
        order.setPaymentMethod(Order.PaymentMethod.valueOf(req.getPaymentMethod()));
        order.setStatus(Order.OrderStatus.PROCESSING);
        order.setCreatedAt(LocalDateTime.now());
        order.setItems(new ArrayList<>());

        double total = 0.0;
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            // ── DEDUCT STOCK ────────────────────────────────────────────────
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSelectedSize(cartItem.getSelectedSize());
            orderItem.setPriceAtPurchase(product.getPrice());
            order.getItems().add(orderItem);
            total += product.getPrice() * cartItem.getQuantity();
        }
        order.setTotalPrice(total);

        Order saved = orderRepository.save(order);

        // ── CLEAR CART ──────────────────────────────────────────────────────
        cart.getItems().clear();
        cartRepository.save(cart);

        return saved;
    }

    // Bug fix: always fetch fresh from DB
    public List<Order> getOrderHistory(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
    }

    @Transactional
    public Order updateStatus(Long orderId, String status) {
        Order order = getById(orderId);
        order.setStatus(Order.OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }
}
