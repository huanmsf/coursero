package com.education.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.entity.SystemLog;

public interface SystemLogService {
    void saveLog(SystemLog log);
    
    Page<SystemLog> getLogList(Integer pageNum, Integer pageSize, String type, String username, String startTime, String endTime);
    
    SystemLog getLogById(Long id);
    
    void deleteLog(Long id);
    
    void clearLogs();
} 