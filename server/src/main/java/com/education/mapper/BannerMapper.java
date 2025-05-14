package com.education.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.entity.Banner;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface BannerMapper extends BaseMapper<Banner> {
    @Select("SELECT * FROM banner WHERE enabled = 1 ORDER BY sort ASC")
    List<Banner> selectEnabledBanners();
} 