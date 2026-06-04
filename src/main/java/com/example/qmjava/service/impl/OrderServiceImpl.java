package com.example.qmjava.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.qmjava.entity.*;
import com.example.qmjava.mapper.*;
import com.example.qmjava.service.OrderService;
import com.example.qmjava.service.ProductService;
import com.example.qmjava.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Autowired
    private ShippingAddressMapper shippingAddressMapper;

    @Autowired
    private ProductMapper productMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Order createOrder(Long userId, Long addressId, String remark, String paymentMethod) {
        if (userId == null) {
            throw new RuntimeException("用户ID不能为空");
        }
        if (addressId == null) {
            throw new RuntimeException("收货地址ID不能为空");
        }

        List<ShoppingCart> cartItems = shoppingCartService.getCartByUserId(userId);
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("购物车为空，请先添加商品");
        }

        ShippingAddress address = shippingAddressMapper.selectById(addressId);
        if (address == null) {
            throw new RuntimeException("收货地址不存在");
        }
        if (!address.getUserId().equals(userId)) {
            throw new RuntimeException("收货地址不属于当前用户");
        }

        List<Long> productIds = new ArrayList<>();
        for (ShoppingCart item : cartItems) {
            if (item.getProductId() == null) {
                throw new RuntimeException("购物车商品ID不能为空");
            }
            productIds.add(item.getProductId());
        }
        
        if (productIds.isEmpty()) {
            throw new RuntimeException("购物车中没有有效商品");
        }
        
        Map<Long, Product> productMap = new HashMap<>();
        List<Product> products = productMapper.selectBatchIds(productIds);
        if (products == null || products.isEmpty()) {
            throw new RuntimeException("未找到购物车中的商品");
        }
        for (Product product : products) {
            productMap.put(product.getId(), product);
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (ShoppingCart cartItem : cartItems) {
            Long productId = cartItem.getProductId();
            Integer quantity = cartItem.getQuantity();
            
            if (quantity == null || quantity <= 0) {
                throw new RuntimeException("商品数量必须大于0");
            }

            Product product = productMap.get(productId);
            if (product == null) {
                throw new RuntimeException("商品ID " + productId + " 不存在");
            }
            if (product.getStatus() == null || product.getStatus() != 1) {
                throw new RuntimeException("商品" + product.getName() + "已下架或状态异常");
            }
            if (product.getStock() == null || product.getStock() < quantity) {
                throw new RuntimeException("商品" + product.getName() + "库存不足，当前库存: " + (product.getStock() != null ? product.getStock() : 0) + "，需要: " + quantity);
            }
            if (product.getPrice() == null) {
                throw new RuntimeException("商品" + product.getName() + "价格异常");
            }

            BigDecimal subtotal = product.getPrice().multiply(new BigDecimal(quantity));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(productId);
            orderItem.setProductName(product.getName());
            orderItem.setProductImage(product.getMainImage());
            orderItem.setProductPrice(product.getPrice());
            orderItem.setQuantity(quantity);
            orderItem.setSubtotal(subtotal);
            orderItems.add(orderItem);

            product.setStock(product.getStock() - quantity);
        }

        for (Product product : productMap.values()) {
            if (product.getStock() < 0) {
                throw new RuntimeException("商品" + product.getName() + "库存不足");
            }
            product.setUpdateTime(LocalDateTime.now());
            productMapper.updateById(product);
        }

        Order order = new Order();
        order.setOrderNo(generateOrderNo());
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setActualAmount(totalAmount);
        order.setStatus(0);
        order.setPaymentMethod(paymentMethod);
        order.setReceiverName(address.getReceiverName());
        order.setReceiverPhone(address.getReceiverPhone());
        order.setReceiverAddress(address.getProvince() + address.getCity() + address.getDistrict() + address.getDetailedAddress());
        order.setRemark(remark);
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        baseMapper.insert(order);

        for (OrderItem orderItem : orderItems) {
            orderItem.setOrderId(order.getId());
            orderItemMapper.insert(orderItem);
        }

        shoppingCartService.clearCart(userId);
        return order;
    }

    private String generateOrderNo() {
        return "ORD" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + 
               String.format("%04d", (int)(Math.random() * 10000));
    }

    @Override
    public Order getOrderDetail(Long orderId) {
        return baseMapper.selectById(orderId);
    }

    @Override
    public Page<Order> getOrderList(Page<Order> page, Long userId, Integer status) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        if (userId != null) {
            wrapper.eq(Order::getUserId, userId);
        }
        if (status != null) {
            wrapper.eq(Order::getStatus, status);
        }
        wrapper.orderByDesc(Order::getCreateTime);
        Page<Order> result = baseMapper.selectPage(page, wrapper);
        
        for (Order order : result.getRecords()) {
            LambdaQueryWrapper<OrderItem> itemWrapper = new LambdaQueryWrapper<>();
            itemWrapper.eq(OrderItem::getOrderId, order.getId());
            List<OrderItem> items = orderItemMapper.selectList(itemWrapper);
            
            for (OrderItem item : items) {
                Product product = productMapper.selectById(item.getProductId());
                item.setProduct(product);
            }
            order.setItems(items);
        }
        
        return result;
    }

    @Override
    @Transactional
    public boolean cancelOrder(Long orderId) {
        Order order = baseMapper.selectById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new RuntimeException("订单状态不允许取消");
        }

        order.setStatus(4);
        order.setUpdateTime(LocalDateTime.now());
        baseMapper.updateById(order);

        LambdaQueryWrapper<OrderItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OrderItem::getOrderId, orderId);
        List<OrderItem> orderItems = orderItemMapper.selectList(wrapper);

        for (OrderItem item : orderItems) {
            Product product = productMapper.selectById(item.getProductId());
            product.setStock(product.getStock() + item.getQuantity());
            productMapper.updateById(product);
        }

        return true;
    }

    @Override
    public boolean confirmOrder(Long orderId) {
        Order order = baseMapper.selectById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        if (order.getStatus() != 2) {
            throw new RuntimeException("订单状态不允许确认收货");
        }

        order.setStatus(3);
        order.setUpdateTime(LocalDateTime.now());
        return baseMapper.updateById(order) > 0;
    }

    @Override
    public boolean payOrder(Long orderId, String paymentMethod) {
        Order order = baseMapper.selectById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new RuntimeException("订单状态不允许支付");
        }

        order.setStatus(1);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        baseMapper.updateById(order);

        LambdaQueryWrapper<OrderItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OrderItem::getOrderId, orderId);
        List<OrderItem> orderItems = orderItemMapper.selectList(wrapper);

        for (OrderItem item : orderItems) {
            productService.updateSales(item.getProductId(), item.getQuantity());
        }

        return true;
    }

    @Override
    public List<Map<String, Object>> getOrderStatistics() {
        List<Map<String, Object>> statistics = new ArrayList<>();
        
        Map<String, Object> totalOrders = new HashMap<>();
        totalOrders.put("name", "总订单数");
        totalOrders.put("value", baseMapper.selectCount(null));
        statistics.add(totalOrders);

        Map<String, Object> pendingOrders = new HashMap<>();
        LambdaQueryWrapper<Order> wrapper1 = new LambdaQueryWrapper<>();
        wrapper1.eq(Order::getStatus, 0);
        pendingOrders.put("name", "待付款订单");
        pendingOrders.put("value", baseMapper.selectCount(wrapper1));
        statistics.add(pendingOrders);

        Map<String, Object> completedOrders = new HashMap<>();
        LambdaQueryWrapper<Order> wrapper2 = new LambdaQueryWrapper<>();
        wrapper2.eq(Order::getStatus, 3);
        completedOrders.put("name", "已完成订单");
        completedOrders.put("value", baseMapper.selectCount(wrapper2));
        statistics.add(completedOrders);

        return statistics;
    }

    @Override
    public BigDecimal getTotalSales() {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getStatus, 3);
        wrapper.select(Order::getActualAmount);
        List<Order> orders = baseMapper.selectList(wrapper);
        
        BigDecimal totalSales = BigDecimal.ZERO;
        for (Order order : orders) {
            if (order.getActualAmount() != null) {
                totalSales = totalSales.add(order.getActualAmount());
            }
        }
        return totalSales;
    }

    @Override
    @Transactional
    public boolean updateOrderStatus(Long orderId, Integer status) {
        Order order = baseMapper.selectById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        order.setStatus(status);
        order.setUpdateTime(LocalDateTime.now());
        return baseMapper.updateById(order) > 0;
    }
}