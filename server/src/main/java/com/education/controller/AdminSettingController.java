package com.education.controller;

import com.education.annotation.Log;
import com.education.common.api.Result;
import com.education.entity.SystemSetting;
import com.education.service.SystemSettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/settings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettingController {
    
    @Autowired
    private SystemSettingService systemSettingService;
    
    @GetMapping
    public Result<List<SystemSetting>> getAllSettings() {
        List<SystemSetting> settings = systemSettingService.getAllSettings();
        return Result.success(settings);
    }
    
    @GetMapping("/map")
    public Result<Map<String, String>> getSettingsMap() {
        Map<String, String> settings = systemSettingService.getSettingsMap();
        return Result.success(settings);
    }
    
    @GetMapping("/{settingKey}")
    public Result<String> getValue(@PathVariable String settingKey) {
        String settingValue = systemSettingService.getValue(settingKey);
        return Result.success(settingValue);
    }
    
    @PostMapping
    @Log("更新系统设置")
    public Result<Void> updateSettings(@RequestBody Map<String, String> settings) {
        systemSettingService.updateSettings(settings);
        return Result.success();
    }
    
    @PostMapping("/{settingKey}")
    @Log("更新系统设置")
    public Result<Void> setValue(
            @PathVariable String settingKey,
            @RequestParam String settingValue,
            @RequestParam(required = false) String description) {
        systemSettingService.setValue(settingKey, settingValue, description);
        return Result.success();
    }
    
    @DeleteMapping("/{settingKey}")
    @Log("删除系统设置")
    public Result<Void> deleteSetting(@PathVariable String settingKey) {
        systemSettingService.deleteSetting(settingKey);
        return Result.success();
    }
} 