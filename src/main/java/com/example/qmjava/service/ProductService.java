package com.example.qmjava.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.qmjava.entity.Product;

import java.util.List;

public interface ProductService extends IService<Product> {
    Page<Product> getProductList(Page<Product> page, String categoryIds, String keyword, Integer status, Integer isHot, Integer isNew);
    Product getProductDetail(Long id);
    List<Product> getHotProducts(Integer limit);
    List<Product> getNewProducts(Integer limit);
    List<Product> getRelatedProducts(Long categoryId, Long productId, Integer limit);
    boolean addProduct(Product product);
    boolean updateProduct(Product product);
    boolean deleteProduct(Long id);
    boolean updateStock(Long productId, Integer quantity);
    boolean updateSales(Long productId, Integer quantity);
}