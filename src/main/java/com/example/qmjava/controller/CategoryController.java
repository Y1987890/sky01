package com.example.qmjava.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.qmjava.common.PageResult;
import com.example.qmjava.common.Result;
import com.example.qmjava.entity.Category;
import com.example.qmjava.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@CrossOrigin
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/tree")
    public Result<List<Category>> getCategoryTree() {
        try {
            List<Category> tree = categoryService.getCategoryTree();
            return Result.success(tree);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/top")
    public Result<List<Category>> getTopCategories() {
        try {
            List<Category> categories = categoryService.getTopCategories();
            return Result.success(categories);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/sub/{parentId}")
    public Result<List<Category>> getSubCategories(@PathVariable Long parentId) {
        try {
            List<Category> categories = categoryService.getSubCategories(parentId);
            return Result.success(categories);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/list")
    public Result<PageResult<Category>> getCategoryList(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword) {
        try {
            Page<Category> page = new Page<>(current, size);
            Page<Category> result = categoryService.getCategoryList(page, keyword);
            return Result.success(PageResult.of(result));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<String> addCategory(@RequestBody Category category) {
        try {
            categoryService.addCategory(category);
            return Result.success("添加成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<String> updateCategory(@RequestBody Category category) {
        try {
            categoryService.updateCategory(category);
            return Result.success("更新成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return Result.success("删除成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}