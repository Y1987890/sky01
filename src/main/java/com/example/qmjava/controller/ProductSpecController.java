package com.example.qmjava.controller;

import com.example.qmjava.common.Result;
import com.example.qmjava.entity.ProductSpec;
import com.example.qmjava.service.ProductSpecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-specs")
@CrossOrigin
public class ProductSpecController {

    @Autowired
    private ProductSpecService productSpecService;

    @GetMapping("/product/{productId}")
    public Result<List<ProductSpec>> getSpecsByProduct(@PathVariable Long productId) {
        try {
            List<ProductSpec> specs = productSpecService.getSpecsByProductId(productId);
            return Result.success(specs);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/options/{productId}")
    public Result<Map<String, List<String>>> getSpecOptions(@PathVariable Long productId) {
        try {
            Map<String, List<String>> options = productSpecService.getSpecOptions(productId);
            return Result.success(options);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/batch/{productId}")
    public Result<String> addSpecs(@PathVariable Long productId, @RequestBody List<ProductSpec> specs) {
        try {
            productSpecService.addSpecs(productId, specs);
            return Result.success("添加成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Result<String> updateSpec(@PathVariable Long id, @RequestBody ProductSpec spec) {
        try {
            productSpecService.updateSpec(id, spec);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteSpec(@PathVariable Long id) {
        try {
            productSpecService.deleteSpec(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/product/{productId}")
    public Result<String> deleteSpecsByProduct(@PathVariable Long productId) {
        try {
            productSpecService.deleteSpecsByProductId(productId);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Result<ProductSpec> getSpecById(@PathVariable Long id) {
        try {
            ProductSpec spec = productSpecService.getSpecById(id);
            return Result.success(spec);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}