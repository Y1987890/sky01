package com.example.qmjava.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.qmjava.common.PageResult;
import com.example.qmjava.common.Result;
import com.example.qmjava.entity.Product;
import com.example.qmjava.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/list")
    public Result<PageResult<Product>> getProductList(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String categoryIds,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer isHot,
            @RequestParam(required = false) Integer isNew) {
        try {
            Page<Product> page = new Page<>(current, size);
            Page<Product> result = productService.getProductList(page, categoryIds, keyword, status, isHot, isNew);
            return Result.success(PageResult.of(result));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    public Result<Product> getProductDetail(@PathVariable Long id) {
        try {
            Product product = productService.getProductDetail(id);
            return Result.success(product);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/hot")
    public Result<List<Product>> getHotProducts(@RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<Product> products = productService.getHotProducts(limit);
            return Result.success(products);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/new")
    public Result<List<Product>> getNewProducts(@RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<Product> products = productService.getNewProducts(limit);
            return Result.success(products);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/related/{categoryId}/{productId}")
    public Result<List<Product>> getRelatedProducts(
            @PathVariable Long categoryId,
            @PathVariable Long productId,
            @RequestParam(defaultValue = "6") Integer limit) {
        try {
            List<Product> products = productService.getRelatedProducts(categoryId, productId, limit);
            return Result.success(products);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<String> addProduct(@RequestBody Product product) {
        try {
            productService.addProduct(product);
            return Result.success("添加成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public Result<String> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            product.setId(id);
            productService.updateProduct(product);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}