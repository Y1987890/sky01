package com.example.qmjava.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.qmjava.entity.ProductReview;
import com.example.qmjava.mapper.ProductReviewMapper;
import com.example.qmjava.service.ProductReviewService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductReviewServiceImpl extends ServiceImpl<ProductReviewMapper, ProductReview> implements ProductReviewService {

    @Override
    public List<ProductReview> getProductReviews(Long productId) {
        LambdaQueryWrapper<ProductReview> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProductReview::getProductId, productId);
        wrapper.eq(ProductReview::getStatus, 1);
        wrapper.orderByDesc(ProductReview::getCreateTime);
        return baseMapper.selectList(wrapper);
    }

    @Override
    public Page<ProductReview> getReviewList(Page<ProductReview> page, Long productId, Integer rating) {
        LambdaQueryWrapper<ProductReview> wrapper = new LambdaQueryWrapper<>();
        if (productId != null) {
            wrapper.eq(ProductReview::getProductId, productId);
        }
        if (rating != null) {
            wrapper.eq(ProductReview::getRating, rating);
        }
        wrapper.eq(ProductReview::getStatus, 1);
        wrapper.orderByDesc(ProductReview::getCreateTime);
        return baseMapper.selectPage(page, wrapper);
    }

    @Override
    public boolean addReview(ProductReview review) {
        review.setCreateTime(LocalDateTime.now());
        return baseMapper.insert(review) > 0;
    }

    @Override
    public boolean deleteReview(Long id) {
        return baseMapper.deleteById(id) > 0;
    }

    @Override
    public Double getAverageRating(Long productId) {
        LambdaQueryWrapper<ProductReview> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProductReview::getProductId, productId);
        wrapper.eq(ProductReview::getStatus, 1);
        List<ProductReview> reviews = baseMapper.selectList(wrapper);
        
        if (reviews.isEmpty()) {
            return 0.0;
        }
        
        double sum = reviews.stream().mapToInt(ProductReview::getRating).sum();
        return sum / reviews.size();
    }
}