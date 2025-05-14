package com.education.controller;

import com.education.common.api.Result;
import com.education.entity.SystemSettings;
import com.education.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/settings/system")
public class AdminSettingsController {
    @Autowired
    private SystemSettingsService settingsService;

    @GetMapping
    public Result<Map<String, Object>> getSettings() {
        return Result.success(settingsService.getAllSettings());
    }

    @PostMapping
    public Result<Void> updateSettings(@RequestBody Map<String, Object> settings) {
        settingsService.updateSettings(settings);
        return Result.success();
    }

    @GetMapping("/{type}")
    public Result<Map<String, String>> getSettingsByType(@PathVariable String type) {
        return Result.success(settingsService.getSettingsByType(type));
    }

    @PostMapping("/{type}")
    public Result<Void> updateSettingsByType(@PathVariable String type, @RequestBody Map<String, String> settings) {
        settingsService.updateSettingsByType(type, settings);
        return Result.success();
    }
} 