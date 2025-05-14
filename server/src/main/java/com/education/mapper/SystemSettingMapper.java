package com.education.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.entity.SystemSetting;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface SystemSettingMapper extends BaseMapper<SystemSetting> {
    @Select("SELECT * FROM system_setting WHERE setting_key = #{settingKey}")
    SystemSetting selectBySettingKey(String settingKey);
} 