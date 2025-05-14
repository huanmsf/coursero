package com.education.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.entity.SystemLog;
import com.education.mapper.SystemLogMapper;
import com.education.service.SystemLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class SystemLogServiceImpl implements SystemLogService {
    
    @Autowired
    private SystemLogMapper systemLogMapper;
    
    @Override
    @Transactional
    public void saveLog(SystemLog log) {
        systemLogMapper.insert(log);
    }
    
    @Override
    public Page<SystemLog> getLogList(Integer pageNum, Integer pageSize, String type, String username, String startTime, String endTime) {
        LambdaQueryWrapper<SystemLog> wrapper = new LambdaQueryWrapper<>();
        
        // 添加查询条件
        if (StringUtils.hasText(type)) {
            wrapper.eq(SystemLog::getType, type);
        }
        if (StringUtils.hasText(username)) {
            wrapper.like(SystemLog::getUsername, username);
        }
        if (StringUtils.hasText(startTime)) {
            LocalDateTime start = LocalDateTime.parse(startTime, DateTimeFormatter.ISO_DATE_TIME);
            wrapper.ge(SystemLog::getCreatedAt, start);
        }
        if (StringUtils.hasText(endTime)) {
            LocalDateTime end = LocalDateTime.parse(endTime, DateTimeFormatter.ISO_DATE_TIME);
            wrapper.le(SystemLog::getCreatedAt, end);
        }
        
        // 按创建时间倒序排序
        wrapper.orderByDesc(SystemLog::getCreatedAt);
        
        return systemLogMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);
    }
    
    @Override
    public SystemLog getLogById(Long id) {
        return systemLogMapper.selectById(id);
    }
    
    @Override
    @Transactional
    public void deleteLog(Long id) {
        systemLogMapper.deleteById(id);
    }
    
    @Override
    @Transactional
    public void clearLogs() {
        systemLogMapper.delete(null);
    }
} 