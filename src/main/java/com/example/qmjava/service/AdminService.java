package com.example.qmjava.service;

import com.example.qmjava.entity.Admin;

public interface AdminService {
    Admin login(String username, String password);
    Admin getAdminInfo(Long adminId);
    boolean updatePassword(Long adminId, String oldPassword, String newPassword);
}