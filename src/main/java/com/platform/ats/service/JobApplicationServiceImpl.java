package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.application.JobApplication;
import com.platform.ats.entity.application.dto.JobApplicationCreateDTO;
import com.platform.ats.entity.application.vo.JobApplicationVO;
import com.platform.ats.entity.application.vo.JobApplicationEmployerVO;
import com.platform.ats.entity.job.JobInfo;
import com.platform.ats.entity.resume.ResumeInfo;
import com.platform.ats.repository.JobApplicationRepository;
import com.platform.ats.repository.JobInfoRepository;
import com.platform.ats.repository.ResumeInfoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

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

    @Override
    public IPage<JobApplicationEmployerVO> pageCompanyApplications(Page<JobApplicationEmployerVO> page, Long companyId, String status) {
        Page<JobApplication> entityPage = new Page<>(page.getCurrent(), page.getSize());
        IPage<JobApplication> res = jobApplicationRepository.selectPage(entityPage,
                new LambdaQueryWrapper<JobApplication>()
                        .eq(status != null && !status.isEmpty(), JobApplication::getStatus, status));

        // 先根据职位过滤出属于该公司的申请
        if (companyId != null) {
            Set<Long> jobIds = res.getRecords().stream()
                    .map(JobApplication::getJobId)
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toSet());
            if (!jobIds.isEmpty()) {
                Map<Long, JobInfo> jobMap = jobInfoRepository.selectBatchIds(jobIds).stream()
                        .filter(j -> companyId.equals(j.getCompanyId()))
                        .collect(Collectors.toMap(JobInfo::getJobId, Function.identity()));
                List<JobApplication> filtered = res.getRecords().stream()
                        .filter(a -> jobMap.containsKey(a.getJobId()))
                        .collect(Collectors.toList());
                res = new Page<>(res.getCurrent(), res.getSize(), filtered.size());
                ((Page<JobApplication>) res).setRecords(filtered);
            }
        }

        Page<JobApplicationEmployerVO> voPage = new Page<>(res.getCurrent(), res.getSize(), res.getTotal());
        voPage.setRecords(buildEmployerVOs(res.getRecords()));
        return voPage;
    }

    @Override
    public java.util.List<JobApplicationEmployerVO> listJobApplications(Long jobId) {
        List<JobApplication> list = jobApplicationRepository.selectList(new LambdaQueryWrapper<JobApplication>()
                .eq(JobApplication::getJobId, jobId));
        return buildEmployerVOs(list);
    }

    private List<JobApplicationEmployerVO> buildEmployerVOs(List<JobApplication> applications) {
        if (applications == null || applications.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return applications.stream().map(entity -> {
            JobApplicationEmployerVO vo = new JobApplicationEmployerVO();
            vo.setApplicationId(entity.getApplicationId());
            vo.setJobId(entity.getJobId());
            vo.setResumeId(entity.getResumeId());
            vo.setStatus(entity.getStatus());
            vo.setApplyTime(entity.getApplyTime());

            JobInfo jobInfo = jobInfoRepository.selectById(entity.getJobId());
            if (jobInfo != null) {
                vo.setJobTitle(jobInfo.getJobName());
            }

            ResumeInfo resumeInfo = resumeInfoRepository.selectById(entity.getResumeId());
            if (resumeInfo != null) {
                vo.setResumeTitle(resumeInfo.getResumeName());
                vo.setUserId(resumeInfo.getUserId());
            }
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public boolean updateStatus(Long applicationId, String status, String reason) {
        if (applicationId == null || status == null || status.isEmpty()) {
            throw new BizException(ErrorCode.BAD_REQUEST, "状态更新参数不完整");
        }

        LambdaUpdateWrapper<JobApplication> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(JobApplication::getApplicationId, applicationId)
                .set(JobApplication::getStatus, status)
                .set(JobApplication::getUpdateTime, LocalDateTime.now());
        int rows = jobApplicationRepository.update(null, wrapper);
        return rows > 0;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean withdrawApplication(Long applicationId, Long userId) {
        if (applicationId == null || userId == null) {
            throw new BizException(ErrorCode.BAD_REQUEST, "参数不完整");
        }
        
        JobApplication application = jobApplicationRepository.selectById(applicationId);
        if (application == null) {
            throw new BizException(ErrorCode.NOT_FOUND, "申请记录不存在");
        }
        
        if (!userId.equals(application.getUserId())) {
            throw new BizException(ErrorCode.FORBIDDEN, "无权操作此申请");
        }
        
        LambdaUpdateWrapper<JobApplication> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(JobApplication::getApplicationId, applicationId)
                .set(JobApplication::getStatus, "WITHDRAWN")
                .set(JobApplication::getUpdateTime, LocalDateTime.now());
        int rows = jobApplicationRepository.update(null, wrapper);
        return rows > 0;
    }
}