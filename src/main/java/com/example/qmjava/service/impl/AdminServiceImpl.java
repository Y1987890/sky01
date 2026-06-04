package com.example.qmjava.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.qmjava.entity.Admin;
import com.example.qmjava.mapper.AdminMapper;
import com.example.qmjava.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Autowired
    private AdminMapper adminMapper;

    @Override
    public Admin login(String username, String password) {
        logger.info("管理员登录尝试 - 用户名: {}", username);
        
        LambdaQueryWrapper<Admin> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Admin::getUsername, username);
        Admin admin = adminMapper.selectOne(wrapper);

        if (admin == null) {
            logger.warn("管理员不存在 - 用户名: {}", username);
            throw new RuntimeException("管理员不存在");
        }

        logger.info("找到管理员 - ID: {}, 用户名: {}", admin.getId(), admin.getUsername());
        logger.info("数据库密码: {}", admin.getPassword());
        
        String inputPasswordHash = DigestUtils.md5DigestAsHex(password.getBytes(StandardCharsets.UTF_8));
        logger.info("输入密码的MD5哈希: {}", inputPasswordHash);

        if (!admin.getPassword().equals(inputPasswordHash)) {
            logger.warn("密码错误 - 数据库密码: {}, 输入密码哈希: {}", admin.getPassword(), inputPasswordHash);
            throw new RuntimeException("密码错误");
        }

        if (admin.getStatus() == 0) {
            logger.warn("账户已被禁用 - 管理员ID: {}", admin.getId());
            throw new RuntimeException("账户已被禁用");
        }

        admin.setLastLoginTime(LocalDateTime.now());
        adminMapper.updateById(admin);
        logger.info("登录成功 - 管理员ID: {}", admin.getId());
        return admin;
    }

    @Override
    public Admin getAdminInfo(Long adminId) {
        return adminMapper.selectById(adminId);
    }

    @Override
    public boolean updatePassword(Long adminId, String oldPassword, String newPassword) {
        Admin admin = adminMapper.selectById(adminId);
        if (!admin.getPassword().equals(DigestUtils.md5DigestAsHex(oldPassword.getBytes()))) {
            throw new RuntimeException("原密码错误");
        }
        admin.setPassword(DigestUtils.md5DigestAsHex(newPassword.getBytes()));
        return adminMapper.updateById(admin) > 0;
    }
}