package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.application.dto.JobApplicationCreateDTO;
import com.platform.ats.entity.application.vo.JobApplicationVO;

public interface JobApplicationService {

    Long apply(JobApplicationCreateDTO dto);

    IPage<JobApplicationVO> pageMyApplications(Page<JobApplicationVO> page, Long userId, String status);
}

