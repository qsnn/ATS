package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.job.JobInfo;
import com.platform.ats.entity.job.dto.JobInfoDetailDto;
import com.platform.ats.entity.job.dto.JobInfoQueryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 职位信息表 接口
 */
public interface JobInfoRepository extends BaseMapper<JobInfo> {
    /**
     * 分页查询职位详情列表
     * @param page 分页对象
     * @param queryDto 查询参数
     * @return
     */
    IPage<JobInfoDetailDto> findJobPage(Page<?> page, @Param("query") JobInfoQueryDto queryDto);

}