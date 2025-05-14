package com.education.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.annotation.Log;
import com.education.common.api.Result;
import com.education.entity.User;
import com.education.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public Result<Page<User>> getUserList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String role) {
        Page<User> page = userService.getUserList(pageNum, pageSize, username, role);
        return Result.success(page);
    }
    
    @GetMapping("/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return Result.success(user);
    }
    
    @PostMapping
    @Log("创建用户")
    public Result<Void> createUser(@RequestBody User user) {
        userService.createUser(user);
        return Result.success();
    }
    
    @PutMapping("/{id}")
    @Log("更新用户")
    public Result<Void> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        userService.updateUser(user);
        return Result.success();
    }
    
    @DeleteMapping("/{id}")
    @Log("删除用户")
    public Result<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }
    
    @PutMapping("/{id}/status")
    @Log("更新用户状态")
    public Result<Void> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Boolean enabled) {
        userService.updateUserStatus(id, enabled);
        return Result.success();
    }
    
    @PutMapping("/{id}/password")
    @Log("更新用户密码")
    public Result<Void> updateUserPassword(
            @PathVariable Long id,
            @RequestParam String newPassword) {
        userService.updateUserPassword(id, newPassword);
        return Result.success();
    }
    
    @PutMapping("/{id}/role")
    @Log("更新用户角色")
    public Result<Void> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role) {
        userService.updateUserRole(id, role);
        return Result.success();
    }
} 