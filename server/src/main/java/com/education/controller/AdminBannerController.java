package com.education.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.annotation.Log;
import com.education.common.api.Result;
import com.education.entity.Banner;
import com.education.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/banners")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBannerController {
    
    @Autowired
    private BannerService bannerService;
    
    @GetMapping
    public Result<Page<Banner>> getBannerList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<Banner> page = bannerService.getBannerList(pageNum, pageSize);
        return Result.success(page);
    }
    
    @GetMapping("/enabled")
    public Result<List<Banner>> getEnabledBanners() {
        List<Banner> banners = bannerService.getEnabledBanners();
        return Result.success(banners);
    }
    
    @GetMapping("/{id}")
    public Result<Banner> getBannerById(@PathVariable Long id) {
        Banner banner = bannerService.getBannerById(id);
        return Result.success(banner);
    }
    
    @PostMapping
    @Log("创建轮播图")
    public Result<Void> createBanner(@RequestBody Banner banner) {
        bannerService.createBanner(banner);
        return Result.success();
    }
    
    @PutMapping("/{id}")
    @Log("更新轮播图")
    public Result<Void> updateBanner(@PathVariable Long id, @RequestBody Banner banner) {
        banner.setId(id);
        bannerService.updateBanner(banner);
        return Result.success();
    }
    
    @DeleteMapping("/{id}")
    @Log("删除轮播图")
    public Result<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return Result.success();
    }
    
    @PutMapping("/{id}/status")
    @Log("更新轮播图状态")
    public Result<Void> updateBannerStatus(
            @PathVariable Long id,
            @RequestParam Boolean enabled) {
        bannerService.updateBannerStatus(id, enabled);
        return Result.success();
    }
    
    @PutMapping("/{id}/sort")
    @Log("更新轮播图排序")
    public Result<Void> updateBannerSort(
            @PathVariable Long id,
            @RequestParam Integer sort) {
        bannerService.updateBannerSort(id, sort);
        return Result.success();
    }
} 