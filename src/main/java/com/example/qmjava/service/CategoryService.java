package com.example.qmjava.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.qmjava.entity.Category;

import java.util.List;

public interface CategoryService extends IService<Category> {
    List<Category> getCategoryTree();
    List<Category> getTopCategories();
    List<Category> getSubCategories(Long parentId);
    boolean addCategory(Category category);
    boolean updateCategory(Category category);
    boolean deleteCategory(Long id);
    Page<Category> getCategoryList(Page<Category> page, String keyword);
}