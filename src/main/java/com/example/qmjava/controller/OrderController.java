package com.example.qmjava.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.qmjava.common.PageResult;
import com.example.qmjava.common.Result;
import com.example.qmjava.entity.Order;
import com.example.qmjava.service.OrderService;
import com.example.qmjava.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/create")
    public Result<Order> createOrder(@RequestHeader("Authorization") String token, @RequestBody Map<String, Object> params) {
        try {
            Long userId = jwtUtil.getUserId(token);
            Long addressId = Long.valueOf(params.get("addressId").toString());
            String remark = params.get("remark") != null ? params.get("remark").toString() : null;
            String paymentMethod = params.get("paymentMethod") != null ? params.get("paymentMethod").toString() : null;
            Order order = orderService.createOrder(userId, addressId, remark, paymentMethod);
            return Result.success(order);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/detail/{orderId}")
    public Result<Order> getOrderDetail(@PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderDetail(orderId);
            return Result.success(order);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/list")
    public Result<PageResult<Order>> getOrderList(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) Integer status) {
        try {
            Long userId = jwtUtil.getUserId(token);
            Page<Order> page = new Page<>(current, size);
            Page<Order> result = orderService.getOrderList(page, userId, status);
            return Result.success(PageResult.of(result));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/cancel/{orderId}")
    public Result<String> cancelOrder(@PathVariable Long orderId) {
        try {
            orderService.cancelOrder(orderId);
            return Result.success("取消成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/confirm/{orderId}")
    public Result<String> confirmOrder(@PathVariable Long orderId) {
        try {
            orderService.confirmOrder(orderId);
            return Result.success("确认收货成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/pay/{orderId}")
    public Result<String> payOrder(@PathVariable Long orderId, @RequestBody Map<String, String> params) {
        try {
            String paymentMethod = params.get("paymentMethod");
            orderService.payOrder(orderId, paymentMethod);
            return Result.success("支付成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/status/{orderId}")
    public Result<String> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, Object> params) {
        try {
            Integer status = Integer.valueOf(params.get("status").toString());
            orderService.updateOrderStatus(orderId, status);
            return Result.success("状态更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/statistics")
    public Result<List<Map<String, Object>>> getOrderStatistics() {
        try {
            List<Map<String, Object>> statistics = orderService.getOrderStatistics();
            return Result.success(statistics);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}