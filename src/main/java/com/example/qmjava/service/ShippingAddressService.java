package com.example.qmjava.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.qmjava.entity.ShippingAddress;

import java.util.List;

public interface ShippingAddressService extends IService<ShippingAddress> {
    List<ShippingAddress> getAddressList(Long userId);
    ShippingAddress getDefaultAddress(Long userId);
    boolean addAddress(ShippingAddress address);
    boolean updateAddress(ShippingAddress address);
    boolean deleteAddress(Long id);
    boolean setDefaultAddress(Long userId, Long addressId);
}