package com.education.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.entity.Video;
import com.education.mapper.VideoMapper;
import com.education.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class VideoServiceImpl implements VideoService {
    
    @Autowired
    private VideoMapper videoMapper;
    
    @Override
    public Page<Video> getVideoList(Integer pageNum, Integer pageSize, String title, String category) {
        LambdaQueryWrapper<Video> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(title)) {
            wrapper.like(Video::getTitle, title);
        }
        if (StringUtils.hasText(category)) {
            wrapper.eq(Video::getCategory, category);
        }
        
        wrapper.orderByDesc(Video::getCreatedAt);
        return videoMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);
    }
    
    @Override
    public List<Video> getEnabledVideos() {
        return videoMapper.selectEnabledVideos();
    }
    
    @Override
    public List<Video> getEnabledVideosByCategory(String category) {
        return videoMapper.selectEnabledVideosByCategory(category);
    }
    
    @Override
    public Video getVideoById(Long id) {
        return videoMapper.selectById(id);
    }
    
    @Override
    @Transactional
    public void createVideo(Video video) {
        video.setViewCount(0L);
        videoMapper.insert(video);
    }
    
    @Override
    @Transactional
    public void updateVideo(Video video) {
        videoMapper.updateById(video);
    }
    
    @Override
    @Transactional
    public void deleteVideo(Long id) {
        videoMapper.deleteById(id);
    }
    
    @Override
    @Transactional
    public void updateVideoStatus(Long id, Boolean enabled) {
        Video video = new Video();
        video.setId(id);
        video.setEnabled(enabled);
        videoMapper.updateById(video);
    }
    
    @Override
    @Transactional
    public void incrementViewCount(Long id) {
        Video video = videoMapper.selectById(id);
        if (video != null) {
            video.setViewCount(video.getViewCount() + 1);
            videoMapper.updateById(video);
        }
    }
} 