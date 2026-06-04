package com.example.qmjava.controller;

import com.example.qmjava.common.Result;
import com.example.qmjava.dto.CartItemDTO;
import com.example.qmjava.entity.ShoppingCart;
import com.example.qmjava.service.ShoppingCartService;
import com.example.qmjava.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/list")
    public Result<List<CartItemDTO>> getCartList(@RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtUtil.getUserId(token);
            List<CartItemDTO> cartItems = shoppingCartService.getCartItemsWithProduct(userId);
            return Result.success(cartItems);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<String> addToCart(@RequestHeader("Authorization") String token, @RequestBody Map<String, Object> params) {
        try {
            Long userId = jwtUtil.getUserId(token);
            Long productId = Long.valueOf(params.get("productId").toString());
            Integer quantity = Integer.valueOf(params.get("quantity").toString());
            String specIds = params.get("specIds") != null ? params.get("specIds").toString() : null;
            String specInfo = params.get("specInfo") != null ? params.get("specInfo").toString() : null;
            
            if (specIds != null && !specIds.isEmpty()) {
                shoppingCartService.addToCartWithSpecs(userId, productId, quantity, specIds, specInfo);
            } else {
                shoppingCartService.addToCart(userId, productId, quantity);
            }
            return Result.success("添加成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<String> updateCartQuantity(@RequestHeader("Authorization") String token, @RequestBody Map<String, Object> params) {
        try {
            Long userId = jwtUtil.getUserId(token);
            Long productId = Long.valueOf(params.get("productId").toString());
            Integer quantity = Integer.valueOf(params.get("quantity").toString());
            String specIds = params.get("specIds") != null ? params.get("specIds").toString() : null;
            
            if (specIds != null && !specIds.isEmpty()) {
                shoppingCartService.updateCartQuantityWithSpecs(userId, productId, specIds, quantity);
            } else {
                shoppingCartService.updateCartQuantity(userId, productId, quantity);
            }
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/remove")
    public Result<String> removeFromCart(@RequestHeader("Authorization") String token, @RequestBody Map<String, Object> params) {
        try {
            Long userId = jwtUtil.getUserId(token);
            Long productId = Long.valueOf(params.get("productId").toString());
            String specIds = params.get("specIds") != null ? params.get("specIds").toString() : null;
            
            if (specIds != null && !specIds.isEmpty()) {
                shoppingCartService.removeFromCartWithSpecs(userId, productId, specIds);
            } else {
                shoppingCartService.removeFromCart(userId, productId);
            }
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    public Result<String> clearCart(@RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtUtil.getUserId(token);
            shoppingCartService.clearCart(userId);
            return Result.success("清空成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/total")
    public Result<BigDecimal> getCartTotal(@RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtUtil.getUserId(token);
            BigDecimal total = shoppingCartService.getCartTotal(userId);
            return Result.success(total);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}