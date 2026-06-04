package com.example.qmjava.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.qmjava.entity.User;

public interface UserService extends IService<User> {
    User register(User user);
    User login(String username, String password);
    User getUserInfo(Long userId);
    boolean updateUserInfo(User user);
    boolean updatePassword(Long userId, String oldPassword, String newPassword);
    Page<User> getUserList(Page<User> page, String keyword);
}