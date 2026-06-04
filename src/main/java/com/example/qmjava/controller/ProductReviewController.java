package com.example.qmjava.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.qmjava.common.PageResult;
import com.example.qmjava.common.Result;
import com.example.qmjava.entity.ProductReview;
import com.example.qmjava.service.ProductReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/review")
@CrossOrigin
public class ProductReviewController {

    @Autowired
    private ProductReviewService productReviewService;

    @GetMapping("/product/{productId}")
    public Result<List<ProductReview>> getProductReviews(@PathVariable Long productId) {
        try {
            List<ProductReview> reviews = productReviewService.getProductReviews(productId);
            return Result.success(reviews);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/list")
    public Result<PageResult<ProductReview>> getReviewList(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Integer rating) {
        try {
            Page<ProductReview> page = new Page<>(current, size);
            Page<ProductReview> result = productReviewService.getReviewList(page, productId, rating);
            return Result.success(PageResult.of(result));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<String> addReview(@RequestBody ProductReview review) {
        try {
            productReviewService.addReview(review);
            return Result.success("评价成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteReview(@PathVariable Long id) {
        try {
            productReviewService.deleteReview(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/average/{productId}")
    public Result<Double> getAverageRating(@PathVariable Long productId) {
        try {
            Double avgRating = productReviewService.getAverageRating(productId);
            return Result.success(avgRating);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}