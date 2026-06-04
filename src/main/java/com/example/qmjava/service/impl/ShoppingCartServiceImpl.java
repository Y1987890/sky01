package com.example.qmjava.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.qmjava.dto.CartItemDTO;
import com.example.qmjava.entity.Product;
import com.example.qmjava.entity.ShoppingCart;
import com.example.qmjava.mapper.ProductMapper;
import com.example.qmjava.mapper.ShoppingCartMapper;
import com.example.qmjava.service.ProductService;
import com.example.qmjava.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShoppingCartServiceImpl extends ServiceImpl<ShoppingCartMapper, ShoppingCart> implements ShoppingCartService {

    @Autowired
    private ProductService productService;

    @Override
    public List<ShoppingCart> getCartByUserId(Long userId) {
        LambdaQueryWrapper<ShoppingCart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShoppingCart::getUserId, userId);
        return baseMapper.selectList(wrapper);
    }

    public List<CartItemDTO> getCartItemsWithProduct(Long userId) {
        List<ShoppingCart> cartItems = getCartByUserId(userId);
        List<CartItemDTO> result = new ArrayList<>();
        
        for (ShoppingCart item : cartItems) {
            Product product = productService.getById(item.getProductId());
            if (product != null) {
                CartItemDTO dto = new CartItemDTO();
                dto.setId(item.getId());
                dto.setProductId(item.getProductId());
                dto.setSpecIds(item.getSpecIds());
                dto.setSpecInfo(item.getSpecInfo());
                dto.setQuantity(item.getQuantity());
                dto.setProduct(product);
                dto.setSubtotal(product.getPrice().multiply(new BigDecimal(item.getQuantity())));
                result.add(dto);
            }
        }
        
        return result;
    }

    @Override
    public boolean addToCart(Long userId, Long productId, Integer quantity) {
        Product product = productService.getById(productId);
        if (product == null || product.getStatus() != 1) {
            throw new RuntimeException("商品不存在或已下架");
        }
        
        if (product.getStock() < quantity) {
            throw new RuntimeException("库存不足");
        }

        LambdaQueryWrapper<ShoppingCart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShoppingCart::getUserId, userId);
        wrapper.eq(ShoppingCart::getProductId, productId);
        ShoppingCart cartItem = baseMapper.selectOne(wrapper);

        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItem.setUpdateTime(LocalDateTime.now());
            return baseMapper.updateById(cartItem) > 0;
        } else {
            cartItem = new ShoppingCart();
            cartItem.setUserId(userId);
            cartItem.setProductId(productId);
            cartItem.setQuantity(quantity);
            cartItem.setCreateTime(LocalDateTime.now());
            cartItem.setUpdateTime(LocalDateTime.now());
            return baseMapper.insert(cartItem) > 0;
        }
    }

    @Override
    public boolean addToCartWithSpecs(Long userId, Long productId, Integer quantity, String specIds, String specInfo) {
        Product product = productService.getById(productId);
        if (product == null || product.getStatus() != 1) {
            throw new RuntimeException("商品不存在或已下架");
        }

        LambdaQueryWrapper<ShoppingCart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShoppingCart::getUserId, userId);
        wrapper.eq(ShoppingCart::getProductId, productId);
        wrapper.eq(ShoppingCart::getSpecIds, specIds);
        ShoppingCart cartItem = baseMapper.selectOne(wrapper);

        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItem.setUpdateTime(LocalDateTime.now());
            return baseMapper.updateById(cartItem) > 0;
        } else {
            cartItem = new ShoppingCart();
            cartItem.setUserId(userId);
            cartItem.setProductId(productId);
            cartItem.setSpecIds(specIds);
            cartItem.setSpecInfo(specInfo);
            cartItem.setQuantity(quantity);
            cartItem.setCreateTime(LocalDateTime.now());
            cartItem.setUpdateTime(LocalDateTime.now());
            return baseMapper.insert(cartItem) > 0;
        }
    }

    @Override
    public boolean updateCartQuantity(Long userId, Long productId, Integer quantity) {
        if (quantity <= 0) {
            return removeFromCart(userId, productId);
        }

        LambdaQueryWrapper<ShoppingCart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShoppingCart::getUserId, userId);
        wrapper.eq(ShoppingCart::getProductId, productId);
        ShoppingCart cartItem = baseMapper.selectOne(wrapper);

        if (cartItem == null) {
            throw new RuntimeException("购物车中不存在该商品");
        }

        Product product = productService.getById(productId);
        if (product.getStock() < quantity) {
            throw new RuntimeException("库存不足");
        }

        cartItem.setQuantity(quantity);
        cartItem.setUpdateTime(LocalDateTime.now());
        return baseMapper.updateById(cartItem) > 0;
    }

    @Override
    public boolean updateCartQuantityWithSpecs(Long userId, Long productId, String specIds, Integer quantity) {
        if (quantity <= 0) {
            return removeFromCartWithSpecs(userId, productId, specIds);
        }

        LambdaQueryWrapper<ShoppingCart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShoppingCart::getUserId, userId);
        wrapper.eq(ShoppingCart::getProductId, productId);
        wrapper.eq(ShoppingCart::getSpecIds, specIds);
        ShoppingCart cartItem = baseMapper.selectOne(wrapper);

        if (cartItem == null) {
            throw new RuntimeException("购物车中不存在该商品");
        }

        cartItem.setQuantity(quantity);
        cartItem.setUpdateTime(LocalDateTime.now());
        return baseMapper.updateById(cartItem) > 0;
    }

    @Override
    public boolean removeFromCart(Long userId, Long productId) {
        LambdaQueryWrapper<ShoppingCart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShoppingCart::getUserId, userId);
        wrapper.eq(ShoppingCart::getProductId, productId);
        return baseMapper.delete(wrapper) > 0;
    }

    @Override
    public boolean removeFromCartWithSpecs(Long userId, Long productId, String specIds) {
        LambdaQueryWrapper<ShoppingCart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShoppingCart::getUserId, userId);
        wrapper.eq(ShoppingCart::getProductId, productId);
        wrapper.eq(ShoppingCart::getSpecIds, specIds);
        return baseMapper.delete(wrapper) > 0;
    }

    @Override
    public boolean clearCart(Long userId) {
        LambdaQueryWrapper<ShoppingCart> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShoppingCart::getUserId, userId);
        return baseMapper.delete(wrapper) > 0;
    }

    @Override
    public BigDecimal getCartTotal(Long userId) {
        List<ShoppingCart> cartItems = getCartByUserId(userId);
        BigDecimal total = BigDecimal.ZERO;
        for (ShoppingCart item : cartItems) {
            Product product = productService.getById(item.getProductId());
            total = total.add(product.getPrice().multiply(new BigDecimal(item.getQuantity())));
        }
        return total;
    }

    @Override
    public List<CartItemDTO> getAllCartsWithProduct() {
        List<ShoppingCart> allCarts = baseMapper.selectList(null);
        List<CartItemDTO> result = new ArrayList<>();

        for (ShoppingCart item : allCarts) {
            Product product = productService.getById(item.getProductId());
            if (product != null) {
                CartItemDTO dto = new CartItemDTO();
                dto.setId(item.getId());
                dto.setUserId(item.getUserId());
                dto.setProductId(item.getProductId());
                dto.setSpecIds(item.getSpecIds());
                dto.setSpecInfo(item.getSpecInfo());
                dto.setQuantity(item.getQuantity());
                dto.setCreateTime(item.getCreateTime());
                dto.setProduct(product);
                dto.setSubtotal(product.getPrice().multiply(new BigDecimal(item.getQuantity())));
                result.add(dto);
            }
        }

        return result;
    }
}