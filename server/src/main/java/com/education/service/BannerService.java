package com.education.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.entity.Banner;
import java.util.List;

public interface BannerService {
    Page<Banner> getBannerList(Integer pageNum, Integer pageSize);
    
    List<Banner> getEnabledBanners();
    
    Banner getBannerById(Long id);
    
    void createBanner(Banner banner);
    
    void updateBanner(Banner banner);
    
    void deleteBanner(Long id);
    
    void updateBannerStatus(Long id, Boolean enabled);
    
    void updateBannerSort(Long id, Integer sort);
} 