package com.example.qmjava.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.qmjava.entity.Product;
import com.example.qmjava.mapper.ProductMapper;
import com.example.qmjava.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements ProductService {

    @Override
    public Page<Product> getProductList(Page<Product> page, String categoryIds, String keyword, Integer status, Integer isHot, Integer isNew) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(categoryIds)) {
            String[] ids = categoryIds.split(",");
            List<Long> categoryIdList = new java.util.ArrayList<>();
            for (String id : ids) {
                try {
                    categoryIdList.add(Long.parseLong(id.trim()));
                } catch (NumberFormatException e) {
                    // ignore invalid ids
                }
            }
            if (!categoryIdList.isEmpty()) {
                wrapper.in(Product::getCategoryId, categoryIdList);
            }
        }
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Product::getName, keyword)
                    .or().like(Product::getDescription, keyword));
        }
        
        if (status != null) {
            wrapper.eq(Product::getStatus, status);
        }
        
        if (isHot != null) {
            wrapper.eq(Product::getIsHot, isHot);
        }
        
        if (isNew != null) {
            wrapper.eq(Product::getIsNew, isNew);
        }
        
        wrapper.orderByDesc(Product::getCreateTime);
        return baseMapper.selectPage(page, wrapper);
    }

    @Override
    public Product getProductDetail(Long id) {
        return baseMapper.selectById(id);
    }

    @Override
    public List<Product> getHotProducts(Integer limit) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getStatus, 1);
        wrapper.eq(Product::getIsHot, 1);
        wrapper.orderByDesc(Product::getSales);
        wrapper.last("LIMIT " + (limit != null ? limit : 10));
        return baseMapper.selectList(wrapper);
    }

    @Override
    public List<Product> getNewProducts(Integer limit) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getStatus, 1);
        wrapper.eq(Product::getIsNew, 1);
        wrapper.orderByDesc(Product::getCreateTime);
        wrapper.last("LIMIT " + (limit != null ? limit : 10));
        return baseMapper.selectList(wrapper);
    }

    @Override
    public List<Product> getRelatedProducts(Long categoryId, Long productId, Integer limit) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getCategoryId, categoryId);
        wrapper.ne(Product::getId, productId);
        wrapper.eq(Product::getStatus, 1);
        wrapper.orderByDesc(Product::getSales);
        wrapper.last("LIMIT " + (limit != null ? limit : 6));
        return baseMapper.selectList(wrapper);
    }

    @Override
    public boolean addProduct(Product product) {
        return baseMapper.insert(product) > 0;
    }

    @Override
    public boolean updateProduct(Product product) {
        return baseMapper.updateById(product) > 0;
    }

    @Override
    public boolean deleteProduct(Long id) {
        return baseMapper.deleteById(id) > 0;
    }

    @Override
    public boolean updateStock(Long productId, Integer quantity) {
        Product product = baseMapper.selectById(productId);
        if (product.getStock() < quantity) {
            throw new RuntimeException("库存不足");
        }
        product.setStock(product.getStock() - quantity);
        return baseMapper.updateById(product) > 0;
    }

    @Override
    public boolean updateSales(Long productId, Integer quantity) {
        Product product = baseMapper.selectById(productId);
        product.setSales(product.getSales() + quantity);
        return baseMapper.updateById(product) > 0;
    }
}