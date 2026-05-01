package com.sneakcart.service;

import com.sneakcart.dto.request.OrderRequest;
import com.sneakcart.entity.*;
import com.sneakcart.exception.BadRequestException;
import com.sneakcart.exception.ResourceNotFoundException;
import com.sneakcart.repository.CartRepository;
import com.sneakcart.repository.OrderRepository;
import com.sneakcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository  userRepository;
    private final CartRepository  cartRepository;

    @Transactional
    public Order placeOrder(OrderRequest req) {
        // 1. Get user
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId()));

        // 2. Get user's cart
        Cart cart = cartRepository.findByUserId(req.getUserId())
                .orElseThrow(() -> new BadRequestException("Cart is empty — add items before placing order"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty — add items before placing order");
        }

        // 3. Build order
        Order order = Order.builder()
                .user(user)
                .addressLine(req.getAddressLine())
                .city(req.getCity())
                .pinCode(req.getPinCode())
                .phone(req.getPhone())
                .paymentMethod(Order.PaymentMethod.valueOf(req.getPaymentMethod()))
                .status(Order.OrderStatus.PROCESSING)
                .build();

        // 4. Convert cart items → order items, calculate total
        double total = 0.0;
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .selectedSize(cartItem.getSelectedSize())
                    .priceAtPurchase(cartItem.getProduct().getPrice()) // snapshot price
                    .build();
            order.getItems().add(orderItem);
            total += cartItem.getProduct().getPrice() * cartItem.getQuantity();
        }
        order.setTotalPrice(total);

        // 5. Save order to PostgreSQL
        Order saved = orderRepository.save(order);

        // 6. Clear the cart after successful order
        cart.getItems().clear();
        cartRepository.save(cart);

        return saved;
    }

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
