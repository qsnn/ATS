package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.application.dto.JobApplicationCreateDTO;
import com.platform.ats.entity.application.vo.JobApplicationVO;
import com.platform.ats.entity.application.vo.JobApplicationEmployerVO;

import java.util.List;

public interface JobApplicationService {

    Long apply(JobApplicationCreateDTO dto);

    IPage<JobApplicationVO> pageMyApplications(Page<JobApplicationVO> page, Long userId, List<Integer> status);

    // Employer 视角：按公司分页查询申请记录
    IPage<JobApplicationEmployerVO> pageCompanyApplications(Page<JobApplicationEmployerVO> page, Long companyId, List<Integer> status, List<Integer> excludeStatus);

    // Employer 视角：按职位查询所有申请记录
    java.util.List<JobApplicationEmployerVO> listJobApplications(Long jobId);

    // Employer 视角：通过申请ID获取申请详情
    JobApplicationEmployerVO getApplicationById(Long applicationId);

    // 更新申请状态（例如：REJECTED, INTERVIEWED 等）
    boolean updateStatus(Long applicationId, Integer status, String reason);
    
    // 求职者取消申请
    boolean withdrawApplication(Long applicationId, Long userId);
    
    // 求职者删除申请记录（逻辑删除）
    boolean deleteApplication(Long userId, Long jobId, Long resumeId);
    
    // 求职者恢复已删除的申请记录
    Long restoreApplication(Long userId, Long jobId, Long resumeId);
}