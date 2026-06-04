package com.example.qmjava.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.qmjava.entity.ProductSpec;
import com.example.qmjava.mapper.ProductSpecMapper;
import com.example.qmjava.service.ProductSpecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductSpecServiceImpl extends ServiceImpl<ProductSpecMapper, ProductSpec> implements ProductSpecService {

    @Autowired
    private ProductSpecMapper productSpecMapper;

    @Override
    public List<ProductSpec> getSpecsByProductId(Long productId) {
        LambdaQueryWrapper<ProductSpec> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProductSpec::getProductId, productId);
        return productSpecMapper.selectList(wrapper);
    }

    @Override
    public Map<String, List<String>> getSpecOptions(Long productId) {
        List<ProductSpec> specs = getSpecsByProductId(productId);
        return specs.stream()
                .collect(Collectors.groupingBy(
                        ProductSpec::getSpecName,
                        Collectors.mapping(ProductSpec::getSpecValue, Collectors.toList())
                ));
    }

    @Override
    public boolean addSpecs(Long productId, List<ProductSpec> specs) {
        for (ProductSpec spec : specs) {
            spec.setProductId(productId);
            spec.setCreateTime(LocalDateTime.now());
            spec.setUpdateTime(LocalDateTime.now());
            productSpecMapper.insert(spec);
        }
        return true;
    }

    @Override
    public boolean updateSpec(Long id, ProductSpec spec) {
        ProductSpec existing = productSpecMapper.selectById(id);
        if (existing == null) {
            return false;
        }
        existing.setSpecName(spec.getSpecName());
        existing.setSpecValue(spec.getSpecValue());
        existing.setPriceAdjust(spec.getPriceAdjust());
        existing.setStock(spec.getStock());
        existing.setSkuCode(spec.getSkuCode());
        existing.setUpdateTime(LocalDateTime.now());
        return productSpecMapper.updateById(existing) > 0;
    }

    @Override
    public boolean deleteSpec(Long id) {
        return productSpecMapper.deleteById(id) > 0;
    }

    @Override
    public boolean deleteSpecsByProductId(Long productId) {
        LambdaQueryWrapper<ProductSpec> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProductSpec::getProductId, productId);
        return productSpecMapper.delete(wrapper) > 0;
    }

    @Override
    public ProductSpec getSpecById(Long id) {
        return productSpecMapper.selectById(id);
    }
}