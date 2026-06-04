package com.example.qmjava.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.qmjava.entity.ShippingAddress;
import com.example.qmjava.mapper.ShippingAddressMapper;
import com.example.qmjava.service.ShippingAddressService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShippingAddressServiceImpl extends ServiceImpl<ShippingAddressMapper, ShippingAddress> implements ShippingAddressService {

    @Override
    public List<ShippingAddress> getAddressList(Long userId) {
        LambdaQueryWrapper<ShippingAddress> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShippingAddress::getUserId, userId);
        wrapper.orderByDesc(ShippingAddress::getIsDefault);
        wrapper.orderByDesc(ShippingAddress::getCreateTime);
        return baseMapper.selectList(wrapper);
    }

    @Override
    public ShippingAddress getDefaultAddress(Long userId) {
        LambdaQueryWrapper<ShippingAddress> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShippingAddress::getUserId, userId);
        wrapper.eq(ShippingAddress::getIsDefault, true);
        return baseMapper.selectOne(wrapper);
    }

    @Override
    public boolean addAddress(ShippingAddress address) {
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            LambdaQueryWrapper<ShippingAddress> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(ShippingAddress::getUserId, address.getUserId());
            wrapper.eq(ShippingAddress::getIsDefault, true);
            ShippingAddress oldDefault = baseMapper.selectOne(wrapper);
            if (oldDefault != null) {
                oldDefault.setIsDefault(false);
                baseMapper.updateById(oldDefault);
            }
        }
        address.setCreateTime(LocalDateTime.now());
        address.setUpdateTime(LocalDateTime.now());
        return baseMapper.insert(address) > 0;
    }

    @Override
    public boolean updateAddress(ShippingAddress address) {
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            LambdaQueryWrapper<ShippingAddress> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(ShippingAddress::getUserId, address.getUserId());
            wrapper.eq(ShippingAddress::getIsDefault, true);
            wrapper.ne(ShippingAddress::getId, address.getId());
            ShippingAddress oldDefault = baseMapper.selectOne(wrapper);
            if (oldDefault != null) {
                oldDefault.setIsDefault(false);
                baseMapper.updateById(oldDefault);
            }
        }
        address.setUpdateTime(LocalDateTime.now());
        return baseMapper.updateById(address) > 0;
    }

    @Override
    public boolean deleteAddress(Long id) {
        return baseMapper.deleteById(id) > 0;
    }

    @Override
    public boolean setDefaultAddress(Long userId, Long addressId) {
        LambdaQueryWrapper<ShippingAddress> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShippingAddress::getUserId, userId);
        wrapper.eq(ShippingAddress::getIsDefault, true);
        ShippingAddress oldDefault = baseMapper.selectOne(wrapper);
        if (oldDefault != null) {
            oldDefault.setIsDefault(false);
            baseMapper.updateById(oldDefault);
        }

        ShippingAddress newDefault = baseMapper.selectById(addressId);
        if (newDefault == null || !newDefault.getUserId().equals(userId)) {
            throw new RuntimeException("地址不存在");
        }
        newDefault.setIsDefault(true);
        newDefault.setUpdateTime(LocalDateTime.now());
        return baseMapper.updateById(newDefault) > 0;
    }
}