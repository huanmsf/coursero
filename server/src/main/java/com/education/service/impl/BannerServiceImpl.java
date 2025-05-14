package com.education.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.entity.Banner;
import com.education.mapper.BannerMapper;
import com.education.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BannerServiceImpl implements BannerService {
    
    @Autowired
    private BannerMapper bannerMapper;
    
    @Override
    public Page<Banner> getBannerList(Integer pageNum, Integer pageSize) {
        LambdaQueryWrapper<Banner> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Banner::getSort);
        return bannerMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);
    }
    
    @Override
    public List<Banner> getEnabledBanners() {
        return bannerMapper.selectEnabledBanners();
    }
    
    @Override
    public Banner getBannerById(Long id) {
        return bannerMapper.selectById(id);
    }
    
    @Override
    @Transactional
    public void createBanner(Banner banner) {
        bannerMapper.insert(banner);
    }
    
    @Override
    @Transactional
    public void updateBanner(Banner banner) {
        bannerMapper.updateById(banner);
    }
    
    @Override
    @Transactional
    public void deleteBanner(Long id) {
        bannerMapper.deleteById(id);
    }
    
    @Override
    @Transactional
    public void updateBannerStatus(Long id, Boolean enabled) {
        Banner banner = new Banner();
        banner.setId(id);
        banner.setEnabled(enabled);
        bannerMapper.updateById(banner);
    }
    
    @Override
    @Transactional
    public void updateBannerSort(Long id, Integer sort) {
        Banner banner = new Banner();
        banner.setId(id);
        banner.setSort(sort);
        bannerMapper.updateById(banner);
    }
} 