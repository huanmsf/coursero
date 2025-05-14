package com.education.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.annotation.Log;
import com.education.common.api.Result;
import com.education.entity.Video;
import com.education.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/videos")
@PreAuthorize("hasRole('ADMIN')")
public class AdminVideoController {
    
    @Autowired
    private VideoService videoService;
    
    @GetMapping
    public Result<Page<Video>> getVideoList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category) {
        Page<Video> page = videoService.getVideoList(pageNum, pageSize, title, category);
        return Result.success(page);
    }
    
    @GetMapping("/enabled")
    public Result<List<Video>> getEnabledVideos() {
        List<Video> videos = videoService.getEnabledVideos();
        return Result.success(videos);
    }
    
    @GetMapping("/enabled/{category}")
    public Result<List<Video>> getEnabledVideosByCategory(@PathVariable String category) {
        List<Video> videos = videoService.getEnabledVideosByCategory(category);
        return Result.success(videos);
    }
    
    @GetMapping("/{id}")
    public Result<Video> getVideoById(@PathVariable Long id) {
        Video video = videoService.getVideoById(id);
        return Result.success(video);
    }
    
    @PostMapping
    @Log("创建视频")
    public Result<Void> createVideo(@RequestBody Video video) {
        videoService.createVideo(video);
        return Result.success();
    }
    
    @PutMapping("/{id}")
    @Log("更新视频")
    public Result<Void> updateVideo(@PathVariable Long id, @RequestBody Video video) {
        video.setId(id);
        videoService.updateVideo(video);
        return Result.success();
    }
    
    @DeleteMapping("/{id}")
    @Log("删除视频")
    public Result<Void> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return Result.success();
    }
    
    @PutMapping("/{id}/status")
    @Log("更新视频状态")
    public Result<Void> updateVideoStatus(
            @PathVariable Long id,
            @RequestParam Boolean enabled) {
        videoService.updateVideoStatus(id, enabled);
        return Result.success();
    }
} 