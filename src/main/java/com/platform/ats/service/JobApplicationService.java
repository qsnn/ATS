package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.application.dto.JobApplicationCreateDTO;
import com.platform.ats.entity.application.vo.JobApplicationVO;
import com.platform.ats.entity.application.vo.JobApplicationEmployerVO;

public interface JobApplicationService {

    Long apply(JobApplicationCreateDTO dto);

    IPage<JobApplicationVO> pageMyApplications(Page<JobApplicationVO> page, Long userId, String status);

    // Employer 视角：按公司分页查询申请记录
    IPage<JobApplicationEmployerVO> pageCompanyApplications(Page<JobApplicationEmployerVO> page, Long companyId, String status);

    // Employer 视角：按职位查询所有申请记录
    java.util.List<JobApplicationEmployerVO> listJobApplications(Long jobId);

    // 更新申请状态（例如：REJECTED, INTERVIEWED 等）
    boolean updateStatus(Long applicationId, String status, String reason);
    
    // 求职者取消申请
    boolean withdrawApplication(Long applicationId, Long userId);
}