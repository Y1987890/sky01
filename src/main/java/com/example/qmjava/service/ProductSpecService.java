package com.example.qmjava.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.qmjava.entity.ProductSpec;

import java.util.List;
import java.util.Map;

public interface ProductSpecService extends IService<ProductSpec> {
    List<ProductSpec> getSpecsByProductId(Long productId);
    Map<String, List<String>> getSpecOptions(Long productId);
    boolean addSpecs(Long productId, List<ProductSpec> specs);
    boolean updateSpec(Long id, ProductSpec spec);
    boolean deleteSpec(Long id);
    boolean deleteSpecsByProductId(Long productId);
    ProductSpec getSpecById(Long id);
}