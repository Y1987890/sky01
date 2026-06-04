package com.example.qmjava.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.qmjava.common.PageResult;
import com.example.qmjava.common.Result;
import com.example.qmjava.dto.CartItemDTO;
import com.example.qmjava.entity.Admin;
import com.example.qmjava.entity.Order;
import com.example.qmjava.service.AdminService;
import com.example.qmjava.service.OrderService;
import com.example.qmjava.service.ShoppingCartService;
import com.example.qmjava.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        try {
            String username = params.get("username");
            String password = params.get("password");
            Admin admin = adminService.login(username, password);
            
            String token = jwtUtil.generateToken(admin.getId(), admin.getUsername());
            
            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            
            Map<String, Object> adminInfo = new HashMap<>();
            adminInfo.put("id", admin.getId());
            adminInfo.put("username", admin.getUsername());
            adminInfo.put("realName", admin.getRealName());
            adminInfo.put("email", admin.getEmail());
            adminInfo.put("phone", admin.getPhone());
            adminInfo.put("role", admin.getRole());
            adminInfo.put("status", admin.getStatus());
            data.put("admin", adminInfo);
            
            return Result.success(data);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/info")
    public Result<Admin> getAdminInfo(@RequestHeader("Authorization") String token) {
        try {
            Long adminId = jwtUtil.getUserId(token);
            Admin admin = adminService.getAdminInfo(adminId);
            return Result.success(admin);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/password")
    public Result<String> updatePassword(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> params) {
        try {
            Long adminId = jwtUtil.getUserId(token);
            String oldPassword = params.get("oldPassword");
            String newPassword = params.get("newPassword");
            adminService.updatePassword(adminId, oldPassword, newPassword);
            return Result.success("密码修改成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/orders")
    public Result<PageResult<Order>> getOrderList(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) Long userId) {
        try {
            Page<Order> page = new Page<>(current, size);
            Page<Order> result = orderService.getOrderList(page, userId, status);
            return Result.success(PageResult.of(result));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/orders/{orderId}")
    public Result<Order> getOrderDetail(@PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderDetail(orderId);
            return Result.success(order);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/sales")
    public Result<BigDecimal> getTotalSales() {
        try {
            BigDecimal totalSales = orderService.getTotalSales();
            return Result.success(totalSales);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/carts")
    public Result<List<CartItemDTO>> getAllCarts() {
        try {
            List<CartItemDTO> carts = shoppingCartService.getAllCartsWithProduct();
            return Result.success(carts);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/carts/{cartId}")
    public Result<String> removeCartItem(@PathVariable Long cartId) {
        try {
            shoppingCartService.removeById(cartId);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}