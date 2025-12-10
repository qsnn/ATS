package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.platform.ats.entity.application.JobApplication;
import org.apache.ibatis.annotations.Param;

/**
 * 职位申请表 Mapper
 */
public interface JobApplicationRepository extends BaseMapper<JobApplication> {
    /**
     * 将已逻辑删除的申请记录恢复为活跃状态
     * @param userId 用户ID
     * @param jobId 职位ID
     * @param resumeId 简历ID
     * @return 更新记录数
     */
    int updateDeletedApplicationToActive(@Param("userId") Long userId, @Param("jobId") Long jobId, @Param("resumeId") Long resumeId);
}