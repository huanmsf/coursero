package com.education.controller;

import com.education.common.api.Result;
import com.education.entity.Video;
import com.education.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/videos")
public class VideoController {
    
    @Autowired
    private VideoService videoService;
    
    @GetMapping
    public Result<List<Video>> getEnabledVideos() {
        List<Video> videos = videoService.getEnabledVideos();
        return Result.success(videos);
    }
    
    @GetMapping("/category/{category}")
    public Result<List<Video>> getEnabledVideosByCategory(@PathVariable String category) {
        List<Video> videos = videoService.getEnabledVideosByCategory(category);
        return Result.success(videos);
    }
    
    @GetMapping("/{id}")
    public Result<Video> getVideoById(@PathVariable Long id) {
        Video video = videoService.getVideoById(id);
        if (video != null && video.getDeleted()!= null && !video.getDeleted()) {
            //videoService.incrementViewCount(id);
            return Result.success(video);
        }
        return Result.failed("视频不存在或已禁用");
    }
} 