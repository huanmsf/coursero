package com.education.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.common.api.Result;
import com.education.entity.SystemLog;
import com.education.service.SystemLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/logs")
@PreAuthorize("hasRole('ADMIN')")
public class AdminLogController {
    
    @Autowired
    private SystemLogService systemLogService;
    
    @GetMapping
    public Result<Page<SystemLog>> getLogList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime) {
        Page<SystemLog> page = systemLogService.getLogList(pageNum, pageSize, type, username, startTime, endTime);
        return Result.success(page);
    }
    
    @GetMapping("/{id}")
    public Result<SystemLog> getLogById(@PathVariable Long id) {
        SystemLog log = systemLogService.getLogById(id);
        return Result.success(log);
    }
    
    @DeleteMapping("/{id}")
    public Result<Void> deleteLog(@PathVariable Long id) {
        systemLogService.deleteLog(id);
        return Result.success();
    }
    
    @DeleteMapping("/clear")
    public Result<Void> clearLogs() {
        systemLogService.clearLogs();
        return Result.success();
    }
} 