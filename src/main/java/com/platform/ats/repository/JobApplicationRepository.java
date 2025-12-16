package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.application.JobApplication;
import com.platform.ats.entity.application.vo.JobApplicationEmployerVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

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

    /**
     * 统计公司未处理的申请数量（状态为1-已申请）
     * @param companyId 公司ID
     * @return 未处理申请数量
     */
    int countPendingApplicationsByCompanyId(@Param("companyId") Long companyId);

    /**
     * 查询公司在两小时内即将开始的面试
     * @param companyId 公司ID
     * @return 即将开始的面试列表
     */
    List<JobApplication> selectUpcomingInterviewsByCompanyId(@Param("companyId") Long companyId);
}