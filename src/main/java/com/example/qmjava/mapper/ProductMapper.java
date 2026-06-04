package com.example.qmjava.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.qmjava.entity.Product;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {
}