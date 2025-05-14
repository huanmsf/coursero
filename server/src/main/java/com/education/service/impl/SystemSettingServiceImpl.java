package com.education.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.education.entity.SystemSetting;
import com.education.mapper.SystemSettingMapper;
import com.education.service.SystemSettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SystemSettingServiceImpl implements SystemSettingService {
    
    @Autowired
    private SystemSettingMapper systemSettingMapper;
    
    @Override
    public String getValue(String settingKey) {
        SystemSetting setting = systemSettingMapper.selectBySettingKey(settingKey);
        return setting != null ? setting.getSettingValue() : null;
    }
    
    @Override
    @Transactional
    public void setValue(String settingKey, String settingValue) {
        setValue(settingKey, settingValue, null);
    }
    
    @Override
    @Transactional
    public void setValue(String settingKey, String settingValue, String description) {
        SystemSetting setting = systemSettingMapper.selectBySettingKey(settingKey);
        if (setting == null) {
            setting = new SystemSetting();
            setting.setSettingKey(settingKey);
            setting.setSettingValue(settingValue);
            setting.setDescription(description);
            systemSettingMapper.insert(setting);
        } else {
            setting.setSettingValue(settingValue);
            if (description != null) {
                setting.setDescription(description);
            }
            systemSettingMapper.updateById(setting);
        }
    }
    
    @Override
    public List<SystemSetting> getAllSettings() {
        return systemSettingMapper.selectList(null);
    }
    
    @Override
    public Map<String, String> getSettingsMap() {
        List<SystemSetting> settings = getAllSettings();
        return settings.stream()
                .collect(Collectors.toMap(
                        SystemSetting::getSettingKey,
                        SystemSetting::getSettingValue,
                        (v1, v2) -> v1
                ));
    }
    
    @Override
    @Transactional
    public void updateSettings(Map<String, String> settings) {
        settings.forEach(this::setValue);
    }
    
    @Override
    @Transactional
    public void deleteSetting(String settingKey) {
        LambdaQueryWrapper<SystemSetting> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SystemSetting::getSettingKey, settingKey);
        systemSettingMapper.delete(wrapper);
    }
} 