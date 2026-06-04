package com.example.qmjava.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.qmjava.entity.Category;
import com.example.qmjava.mapper.CategoryMapper;
import com.example.qmjava.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Override
    public List<Category> getCategoryTree() {
        List<Category> allCategories = baseMapper.selectList(null);
        return buildTree(allCategories, 0L);
    }

    private List<Category> buildTree(List<Category> categories, Long parentId) {
        List<Category> tree = new ArrayList<>();
        for (Category category : categories) {
            if (category.getParentId().equals(parentId)) {
                List<Category> children = buildTree(categories, category.getId());
                category.setChildren(children);
                tree.add(category);
            }
        }
        return tree;
    }

    @Override
    public List<Category> getTopCategories() {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getParentId, 0L);
        wrapper.eq(Category::getStatus, 1);
        wrapper.orderByAsc(Category::getSortOrder);
        return baseMapper.selectList(wrapper);
    }

    @Override
    public List<Category> getSubCategories(Long parentId) {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getParentId, parentId);
        wrapper.eq(Category::getStatus, 1);
        wrapper.orderByAsc(Category::getSortOrder);
        return baseMapper.selectList(wrapper);
    }

    @Override
    public boolean addCategory(Category category) {
        return baseMapper.insert(category) > 0;
    }

    @Override
    public boolean updateCategory(Category category) {
        return baseMapper.updateById(category) > 0;
    }

    @Override
    public boolean deleteCategory(Long id) {
        return baseMapper.deleteById(id) > 0;
    }

    @Override
    public Page<Category> getCategoryList(Page<Category> page, String keyword) {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Category::getName, keyword);
        }
        wrapper.orderByAsc(Category::getSortOrder);
        return baseMapper.selectPage(page, wrapper);
    }
}