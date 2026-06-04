package com.example.qmjava.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.qmjava.entity.ShippingAddress;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ShippingAddressMapper extends BaseMapper<ShippingAddress> {
}