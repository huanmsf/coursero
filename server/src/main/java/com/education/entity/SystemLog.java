package com.education.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("system_log")
public class SystemLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String type;
    private String username;
    private String action;
    private String ip;
    private String userAgent;
    private String params;
    private String result;
    private String error;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
} 