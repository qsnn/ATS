package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.job.JobInfo;
import com.platform.ats.entity.job.dto.JobInfoDetailDto;
import com.platform.ats.entity.job.dto.JobInfoQueryDto;
import org.apache.ibatis.annotations.Param;

/**
 * 职位信息表 Mapper
 */
public interface JobInfoRepository extends BaseMapper<JobInfo> {

    /**
     * 分页查询职位列表（包含公司名称等关联信息）
     * @param page 分页参数
     * @param query 查询条件DTO
     * @param wrapper 查询条件包装器
     * @return 分页结果
     */

    IPage<JobInfoDetailDto> findJobPage(Page<JobInfoDetailDto> page,
                                        @Param("query") JobInfoQueryDto query);
}