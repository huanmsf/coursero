package com.education.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("video")
public class Video {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String title;
    private String description;
    private String coverUrl;
    private String videoUrl;
    private String category;
    private String tags;
    private Integer duration;
    private Integer status;
    private Long viewCount;
    private Boolean enabled;
    private Boolean deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
} 