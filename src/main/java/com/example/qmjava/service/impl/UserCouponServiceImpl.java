package com.example.qmjava.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.qmjava.entity.UserCoupon;
import com.example.qmjava.mapper.UserCouponMapper;
import com.example.qmjava.service.UserCouponService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserCouponServiceImpl extends ServiceImpl<UserCouponMapper, UserCoupon> implements UserCouponService {

    @Override
    public List<UserCoupon> getUserCoupons(Long userId, Integer status) {
        LambdaQueryWrapper<UserCoupon> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserCoupon::getUserId, userId);
        if (status != null) {
            wrapper.eq(UserCoupon::getStatus, status);
        }
        wrapper.orderByDesc(UserCoupon::getReceiveTime);
        return baseMapper.selectList(wrapper);
    }

    @Override
    public boolean useCoupon(Long userCouponId) {
        UserCoupon userCoupon = baseMapper.selectById(userCouponId);
        if (userCoupon == null) {
            throw new RuntimeException("优惠券不存在");
        }
        if (userCoupon.getStatus() != 0) {
            throw new RuntimeException("优惠券状态不允许使用");
        }

        userCoupon.setStatus(1);
        userCoupon.setUseTime(LocalDateTime.now());
        return baseMapper.updateById(userCoupon) > 0;
    }
}