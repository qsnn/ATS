package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.platform.ats.entity.application.JobApplication;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface JobApplicationRepository extends BaseMapper<JobApplication> {
}

