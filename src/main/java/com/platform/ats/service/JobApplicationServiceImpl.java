package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.application.JobApplication;
import com.platform.ats.entity.application.dto.JobApplicationCreateDTO;
import com.platform.ats.entity.application.vo.JobApplicationVO;
import com.platform.ats.entity.job.JobInfo;
import com.platform.ats.entity.resume.ResumeInfo;
import com.platform.ats.repository.JobApplicationRepository;
import com.platform.ats.repository.JobInfoRepository;
import com.platform.ats.repository.ResumeInfoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobInfoRepository jobInfoRepository;
    private final ResumeInfoRepository resumeInfoRepository;

    public JobApplicationServiceImpl(JobApplicationRepository jobApplicationRepository,
                                     JobInfoRepository jobInfoRepository,
                                     ResumeInfoRepository resumeInfoRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobInfoRepository = jobInfoRepository;
        this.resumeInfoRepository = resumeInfoRepository;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long apply(JobApplicationCreateDTO dto) {
        if (dto == null || dto.getUserId() == null || dto.getJobId() == null || dto.getResumeId() == null) {
            throw new BizException(ErrorCode.BAD_REQUEST, "申请参数不完整");
        }

        JobInfo jobInfo = jobInfoRepository.selectById(dto.getJobId());
        if (jobInfo == null) {
            throw new BizException(ErrorCode.NOT_FOUND, "职位不存在");
        }

        ResumeInfo resumeInfo = resumeInfoRepository.selectById(dto.getResumeId());
        if (resumeInfo == null || !dto.getUserId().equals(resumeInfo.getUserId())) {
            throw new BizException(ErrorCode.FORBIDDEN, "无法使用该简历申请");
        }

        Long count = jobApplicationRepository.selectCount(new LambdaQueryWrapper<JobApplication>()
                .eq(JobApplication::getUserId, dto.getUserId())
                .eq(JobApplication::getJobId, dto.getJobId())
                .eq(JobApplication::getResumeId, dto.getResumeId()));
        if (count != null && count > 0) {
            throw new BizException(ErrorCode.BAD_REQUEST, "已投递过该职位");
        }

        JobApplication entity = new JobApplication();
        entity.setUserId(dto.getUserId());
        entity.setJobId(dto.getJobId());
        entity.setResumeId(dto.getResumeId());        entity.setStatus("APPLIED");
        entity.setApplyTime(LocalDateTime.now());
        entity.setUpdateTime(LocalDateTime.now());

        jobApplicationRepository.insert(entity);
        return entity.getApplicationId();
    }

    @Override
    public IPage<JobApplicationVO> pageMyApplications(Page<JobApplicationVO> page, Long userId, String status) {
        Page<JobApplication> entityPage = new Page<>(page.getCurrent(), page.getSize());
        IPage<JobApplication> res = jobApplicationRepository.selectPage(entityPage,
                new LambdaQueryWrapper<JobApplication>()
                        .eq(JobApplication::getUserId, userId)
                        .eq(status != null && !status.isEmpty(), JobApplication::getStatus, status));

        Page<JobApplicationVO> voPage = new Page<>(res.getCurrent(), res.getSize(), res.getTotal());
        voPage.setRecords(res.getRecords().stream().map(entity -> {
            JobApplicationVO vo = new JobApplicationVO();
            BeanUtils.copyProperties(entity, vo);
            JobInfo jobInfo = jobInfoRepository.selectById(entity.getJobId());
            if (jobInfo != null) {
                vo.setJobTitle(jobInfo.getJobName());
                vo.setCompanyId(jobInfo.getCompanyId());
                // companyName 由前端根据 companyId 关联查询或后续补充
            }
            return vo;
        }).toList());
        return voPage;
    }
}
