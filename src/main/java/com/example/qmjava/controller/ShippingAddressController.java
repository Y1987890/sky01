package com.example.qmjava.controller;

import com.example.qmjava.common.Result;
import com.example.qmjava.entity.ShippingAddress;
import com.example.qmjava.service.ShippingAddressService;
import com.example.qmjava.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@CrossOrigin
public class ShippingAddressController {

    @Autowired
    private ShippingAddressService shippingAddressService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/list")
    public Result<List<ShippingAddress>> getAddressList(@RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtUtil.getUserId(token);
            List<ShippingAddress> addresses = shippingAddressService.getAddressList(userId);
            return Result.success(addresses);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/default")
    public Result<ShippingAddress> getDefaultAddress(@RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtUtil.getUserId(token);
            ShippingAddress address = shippingAddressService.getDefaultAddress(userId);
            return Result.success(address);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<String> addAddress(@RequestHeader("Authorization") String token, @RequestBody ShippingAddress address) {
        try {
            Long userId = jwtUtil.getUserId(token);
            address.setUserId(userId);
            shippingAddressService.addAddress(address);
            return Result.success("添加成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<String> updateAddress(@RequestHeader("Authorization") String token, @RequestBody ShippingAddress address) {
        try {
            Long userId = jwtUtil.getUserId(token);
            address.setUserId(userId);
            shippingAddressService.updateAddress(address);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteAddress(@PathVariable Long id) {
        try {
            shippingAddressService.deleteAddress(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/setDefault/{addressId}")
    public Result<String> setDefaultAddress(@RequestHeader("Authorization") String token, @PathVariable Long addressId) {
        try {
            Long userId = jwtUtil.getUserId(token);
            shippingAddressService.setDefaultAddress(userId, addressId);
            return Result.success("设置成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}