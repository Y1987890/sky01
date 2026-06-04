package com.example.qmjava.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.qmjava.entity.Order;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderMapper extends BaseMapper<Order> {
}