package com.education.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.entity.User;
import com.education.mapper.UserMapper;
import com.education.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public Page<User> getUserList(Integer pageNum, Integer pageSize, String username, String role) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(username)) {
            wrapper.like(User::getUsername, username);
        }
        if (StringUtils.hasText(role)) {
            wrapper.eq(User::getRole, role);
        }
        
        wrapper.orderByDesc(User::getCreatedAt);
        return userMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);
    }
    
    @Override
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }
    
    @Override
    public User getUserByUsername(String username) {
        return userMapper.selectByUsername(username);
    }
    
    @Override
    @Transactional
    public void createUser(User user) {
        // 加密密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userMapper.insert(user);
    }
    
    @Override
    @Transactional
    public void updateUser(User user) {
        // 如果密码不为空，则加密密码
        if (StringUtils.hasText(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(null);
        }
        userMapper.updateById(user);
    }
    
    @Override
    @Transactional
    public void deleteUser(Long id) {
        userMapper.deleteById(id);
    }
    
    @Override
    @Transactional
    public void updateUserStatus(Long id, Boolean enabled) {
        User user = new User();
        user.setId(id);
        user.setEnabled(enabled);
        userMapper.updateById(user);
    }
    
    @Override
    @Transactional
    public void updateUserPassword(Long id, String newPassword) {
        User user = new User();
        user.setId(id);
        user.setPassword(passwordEncoder.encode(newPassword));
        userMapper.updateById(user);
    }
    
    @Override
    @Transactional
    public void updateUserRole(Long id, String role) {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        userMapper.updateById(user);
    }
} 