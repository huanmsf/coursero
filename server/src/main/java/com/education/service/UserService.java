package com.education.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.entity.User;

public interface UserService {
    Page<User> getUserList(Integer pageNum, Integer pageSize, String username, String role);
    
    User getUserById(Long id);
    
    User getUserByUsername(String username);
    
    void createUser(User user);
    
    void updateUser(User user);
    
    void deleteUser(Long id);
    
    void updateUserStatus(Long id, Boolean enabled);
    
    void updateUserPassword(Long id, String newPassword);
    
    void updateUserRole(Long id, String role);
} 