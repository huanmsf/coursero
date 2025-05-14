package com.education.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.entity.Video;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface VideoMapper extends BaseMapper<Video> {
    List<Video> selectEnabledVideos();
    List<Video> selectEnabledVideosByCategory(String category);
} 