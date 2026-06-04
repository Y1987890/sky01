package com.example.qmjava.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.qmjava.entity.Coupon;
import com.example.qmjava.entity.UserCoupon;
import com.example.qmjava.mapper.CouponMapper;
import com.example.qmjava.mapper.UserCouponMapper;
import com.example.qmjava.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CouponServiceImpl extends ServiceImpl<CouponMapper, Coupon> implements CouponService {

    @Autowired
    private UserCouponMapper userCouponMapper;

    @Override
    public List<Coupon> getAvailableCoupons() {
        LambdaQueryWrapper<Coupon> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Coupon::getStatus, 1);
        wrapper.le(Coupon::getStartTime, LocalDateTime.now());
        wrapper.ge(Coupon::getEndTime, LocalDateTime.now());
        wrapper.apply("received_count < total_count");
        return baseMapper.selectList(wrapper);
    }

    @Override
    public Page<Coupon> getCouponList(Page<Coupon> page, String keyword) {
        LambdaQueryWrapper<Coupon> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Coupon::getName, keyword);
        }
        wrapper.orderByDesc(Coupon::getCreateTime);
        return baseMapper.selectPage(page, wrapper);
    }

    @Override
    public boolean addCoupon(Coupon coupon) {
        coupon.setReceivedCount(0);
        coupon.setUsedCount(0);
        coupon.setCreateTime(LocalDateTime.now());
        return baseMapper.insert(coupon) > 0;
    }

    @Override
    public boolean updateCoupon(Coupon coupon) {
        return baseMapper.updateById(coupon) > 0;
    }

    @Override
    public boolean deleteCoupon(Long id) {
        return baseMapper.deleteById(id) > 0;
    }

    @Override
    public boolean receiveCoupon(Long userId, Long couponId) {
        Coupon coupon = baseMapper.selectById(couponId);
        if (coupon == null || coupon.getStatus() != 1) {
            throw new RuntimeException("优惠券不存在或已失效");
        }

        if (coupon.getReceivedCount() >= coupon.getTotalCount()) {
            throw new RuntimeException("优惠券已领完");
        }

        LambdaQueryWrapper<UserCoupon> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserCoupon::getUserId, userId);
        wrapper.eq(UserCoupon::getCouponId, couponId);
        if (userCouponMapper.selectOne(wrapper) != null) {
            throw new RuntimeException("您已领取过该优惠券");
        }

        UserCoupon userCoupon = new UserCoupon();
        userCoupon.setUserId(userId);
        userCoupon.setCouponId(couponId);
        userCoupon.setStatus(0);
        userCoupon.setReceiveTime(LocalDateTime.now());
        userCouponMapper.insert(userCoupon);

        coupon.setReceivedCount(coupon.getReceivedCount() + 1);
        baseMapper.updateById(coupon);

        return true;
    }
}