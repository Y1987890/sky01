package com.example.qmjava.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.qmjava.dto.CartItemDTO;
import com.example.qmjava.entity.ShoppingCart;

import java.math.BigDecimal;
import java.util.List;

public interface ShoppingCartService extends IService<ShoppingCart> {
    List<ShoppingCart> getCartByUserId(Long userId);
    List<CartItemDTO> getCartItemsWithProduct(Long userId);
    boolean addToCart(Long userId, Long productId, Integer quantity);
    boolean addToCartWithSpecs(Long userId, Long productId, Integer quantity, String specIds, String specInfo);
    boolean updateCartQuantity(Long userId, Long productId, Integer quantity);
    boolean updateCartQuantityWithSpecs(Long userId, Long productId, String specIds, Integer quantity);
    boolean removeFromCart(Long userId, Long productId);
    boolean removeFromCartWithSpecs(Long userId, Long productId, String specIds);
    boolean clearCart(Long userId);
    BigDecimal getCartTotal(Long userId);
    List<CartItemDTO> getAllCartsWithProduct();
}