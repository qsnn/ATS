package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.favorite.vo.JobFavoriteVO;

public interface JobFavoriteService {

    Long addFavorite(Long userId, Long jobId);

    boolean removeFavorite(Long userId, Long jobId);

    boolean isFavorited(Long userId, Long jobId);

    IPage<JobFavoriteVO> pageMyFavorites(Page<JobFavoriteVO> page, Long userId);
}

