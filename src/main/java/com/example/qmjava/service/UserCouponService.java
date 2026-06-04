package com.example.qmjava.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.qmjava.entity.UserCoupon;

import java.util.List;

public interface UserCouponService extends IService<UserCoupon> {
    List<UserCoupon> getUserCoupons(Long userId, Integer status);
    boolean useCoupon(Long userCouponId);
}