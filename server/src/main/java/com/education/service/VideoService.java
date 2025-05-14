package com.education.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.entity.Video;
import java.util.List;

public interface VideoService {
    Page<Video> getVideoList(Integer pageNum, Integer pageSize, String title, String category);
    
    List<Video> getEnabledVideos();
    
    List<Video> getEnabledVideosByCategory(String category);
    
    Video getVideoById(Long id);
    
    void createVideo(Video video);
    
    void updateVideo(Video video);
    
    void deleteVideo(Long id);
    
    void updateVideoStatus(Long id, Boolean enabled);
    
    void incrementViewCount(Long id);
} 