package com.example.qmjava.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.qmjava.entity.Coupon;

import java.util.List;

public interface CouponService extends IService<Coupon> {
    List<Coupon> getAvailableCoupons();
    Page<Coupon> getCouponList(Page<Coupon> page, String keyword);
    boolean addCoupon(Coupon coupon);
    boolean updateCoupon(Coupon coupon);
    boolean deleteCoupon(Long id);
    boolean receiveCoupon(Long userId, Long couponId);
}