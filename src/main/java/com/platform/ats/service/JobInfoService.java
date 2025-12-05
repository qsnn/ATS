package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.platform.ats.entity.job.JobInfo;
import com.platform.ats.entity.job.dto.JobInfoDetailDto;
import com.platform.ats.entity.job.dto.JobInfoQueryDto;

/**
 * 职位信息表 服务类
 */
public interface JobInfoService extends IService<JobInfo> {

    /**
     * 分页查询职位列表（包含公司名称等关联信息）
     * @param page 分页参数
     * @param queryDto 查询条件
     * @return 分页结果
     */
    IPage<JobInfoDetailDto> findJobPage(Page<JobInfoDetailDto> page, JobInfoQueryDto queryDto);

    /**
     * 发布职位
     * @param jobId 职位ID
     * @return 是否成功
     */
    boolean publishJob(Long jobId);

    /**
     * 下架职位
     * @param jobId 职位ID
     * @return 是否成功
     */
    boolean unpublishJob(Long jobId);
}