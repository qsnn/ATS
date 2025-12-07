package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.platform.ats.entity.favorite.JobFavorite;

/**
 * 职位收藏表 Mapper
 */
public interface JobFavoriteRepository extends BaseMapper<JobFavorite> {
    /**
     * 将已逻辑删除的收藏记录恢复为活跃状态
     * @param userId 用户ID
     * @param jobId 职位ID
     * @return 更新记录数
     */
    int updateDeletedFavoriteToActive(Long userId, Long jobId);
}

