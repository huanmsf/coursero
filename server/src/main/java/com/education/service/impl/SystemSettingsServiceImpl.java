package com.education.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.education.entity.SystemSettings;
import com.education.mapper.SystemSettingsMapper;
import com.education.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SystemSettingsServiceImpl implements SystemSettingsService {
    @Autowired
    private SystemSettingsMapper settingsMapper;

    @Override
    public Map<String, Object> getAllSettings() {
        List<SystemSettings> settings = settingsMapper.selectList(null);
        Map<String, Object> result = new HashMap<>();
        
        // 按类型分组
        Map<String, List<SystemSettings>> groupedSettings = settings.stream()
                .collect(Collectors.groupingBy(SystemSettings::getType));
        
        // 转换为前端需要的格式
        groupedSettings.forEach((type, typeSettings) -> {
            Map<String, String> typeMap = new HashMap<>();
            typeSettings.forEach(setting -> typeMap.put(setting.getKey(), setting.getValue()));
            result.put(type, typeMap);
        });
        
        return result;
    }

    @Override
    @Transactional
    public void updateSettings(Map<String, Object> settings) {
        settings.forEach((type, value) -> {
            if (value instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, String> typeSettings = (Map<String, String>) value;
                updateSettingsByType(type, typeSettings);
            }
        });
    }

    @Override
    public Map<String, String> getSettingsByType(String type) {
        LambdaQueryWrapper<SystemSettings> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SystemSettings::getType, type);
        List<SystemSettings> settings = settingsMapper.selectList(wrapper);
        
        return settings.stream()
                .collect(Collectors.toMap(SystemSettings::getKey, SystemSettings::getValue));
    }

    @Override
    @Transactional
    public void updateSettingsByType(String type, Map<String, String> settings) {
        settings.forEach((key, value) -> {
            LambdaQueryWrapper<SystemSettings> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(SystemSettings::getType, type)
                    .eq(SystemSettings::getKey, key);
            
            SystemSettings setting = settingsMapper.selectOne(wrapper);
            if (setting != null) {
                setting.setValue(value);
                settingsMapper.updateById(setting);
            } else {
                setting = new SystemSettings();
                setting.setType(type);
                setting.setKey(key);
                setting.setValue(value);
                settingsMapper.insert(setting);
            }
        });
    }
} 