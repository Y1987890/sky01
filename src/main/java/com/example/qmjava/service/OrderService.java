package com.example.qmjava.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.qmjava.entity.Order;
import com.example.qmjava.entity.OrderItem;

import java.util.List;
import java.util.Map;

public interface OrderService extends IService<Order> {
    Order createOrder(Long userId, Long addressId, String remark, String paymentMethod);
    Order getOrderDetail(Long orderId);
    Page<Order> getOrderList(Page<Order> page, Long userId, Integer status);
    boolean cancelOrder(Long orderId);
    boolean confirmOrder(Long orderId);
    boolean payOrder(Long orderId, String paymentMethod);
    List<Map<String, Object>> getOrderStatistics();
    java.math.BigDecimal getTotalSales();
    boolean updateOrderStatus(Long orderId, Integer status);
}