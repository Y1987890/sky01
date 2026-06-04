package com.example.qmjava.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.qmjava.entity.ProductReview;

import java.util.List;

public interface ProductReviewService extends IService<ProductReview> {
    List<ProductReview> getProductReviews(Long productId);
    Page<ProductReview> getReviewList(Page<ProductReview> page, Long productId, Integer rating);
    boolean addReview(ProductReview review);
    boolean deleteReview(Long id);
    Double getAverageRating(Long productId);
}