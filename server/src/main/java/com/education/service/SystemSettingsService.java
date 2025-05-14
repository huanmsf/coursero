package com.education.service;

import java.util.Map;

public interface SystemSettingsService {
    Map<String, Object> getAllSettings();
    void updateSettings(Map<String, Object> settings);
    Map<String, String> getSettingsByType(String type);
    void updateSettingsByType(String type, Map<String, String> settings);
} 