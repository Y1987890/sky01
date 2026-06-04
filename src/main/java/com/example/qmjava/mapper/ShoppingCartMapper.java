package com.example.qmjava.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.qmjava.entity.ShoppingCart;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ShoppingCartMapper extends BaseMapper<ShoppingCart> {
}