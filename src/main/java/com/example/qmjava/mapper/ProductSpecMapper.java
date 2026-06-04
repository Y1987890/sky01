package com.example.qmjava.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.qmjava.entity.ProductSpec;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProductSpecMapper extends BaseMapper<ProductSpec> {
    List<ProductSpec> selectByProductId(Long productId);
}