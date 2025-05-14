package com.education.service;

import com.education.entity.SystemSetting;
import java.util.List;
import java.util.Map;

public interface SystemSettingService {
    String getValue(String settingKey);
    
    void setValue(String settingKey, String settingValue);
    
    void setValue(String settingKey, String settingValue, String description);
    
    List<SystemSetting> getAllSettings();
    
    Map<String, String> getSettingsMap();
    
    void updateSettings(Map<String, String> settings);
    
    void deleteSetting(String settingKey);
} 