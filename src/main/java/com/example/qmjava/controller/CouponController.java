package com.example.qmjava.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.qmjava.common.PageResult;
import com.example.qmjava.common.Result;
import com.example.qmjava.entity.Coupon;
import com.example.qmjava.service.CouponService;
import com.example.qmjava.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupon")
@CrossOrigin
public class CouponController {

    @Autowired
    private CouponService couponService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/available")
    public Result<List<Coupon>> getAvailableCoupons() {
        try {
            List<Coupon> coupons = couponService.getAvailableCoupons();
            return Result.success(coupons);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/list")
    public Result<PageResult<Coupon>> getCouponList(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword) {
        try {
            Page<Coupon> page = new Page<>(current, size);
            Page<Coupon> result = couponService.getCouponList(page, keyword);
            return Result.success(PageResult.of(result));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<String> addCoupon(@RequestBody Coupon coupon) {
        try {
            couponService.addCoupon(coupon);
            return Result.success("添加成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<String> updateCoupon(@RequestBody Coupon coupon) {
        try {
            couponService.updateCoupon(coupon);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteCoupon(@PathVariable Long id) {
        try {
            couponService.deleteCoupon(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/receive/{couponId}")
    public Result<String> receiveCoupon(@RequestHeader("Authorization") String token, @PathVariable Long couponId) {
        try {
            Long userId = jwtUtil.getUserId(token);
            couponService.receiveCoupon(userId, couponId);
            return Result.success("领取成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}