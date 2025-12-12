package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.application.JobApplication;
import com.platform.ats.entity.application.dto.JobApplicationCreateDTO;
import com.platform.ats.entity.application.vo.JobApplicationVO;
import com.platform.ats.entity.application.vo.JobApplicationEmployerVO;
import com.platform.ats.entity.company.CompanyInfo;
import com.platform.ats.entity.job.JobInfo;
import com.platform.ats.entity.resume.ResumeInfo;
import com.platform.ats.repository.CompanyInfoRepository;
import com.platform.ats.repository.JobApplicationRepository;
import com.platform.ats.repository.JobInfoRepository;
import com.platform.ats.repository.ResumeInfoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JobApplicationServiceImpl extends ServiceImpl<JobApplicationRepository, JobApplication> implements JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobInfoRepository jobInfoRepository;
    private final ResumeInfoRepository resumeInfoRepository;
    private final CompanyInfoRepository companyInfoRepository;
    private final ObjectMapper objectMapper;

    public JobApplicationServiceImpl(JobApplicationRepository jobApplicationRepository,
                                     JobInfoRepository jobInfoRepository,
                                     ResumeInfoRepository resumeInfoRepository,
                                     CompanyInfoRepository companyInfoRepository,
                                     ObjectMapper objectMapper) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobInfoRepository = jobInfoRepository;
        this.resumeInfoRepository = resumeInfoRepository;
        this.companyInfoRepository = companyInfoRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long apply(JobApplicationCreateDTO dto) {
        if (dto == null || dto.getUserId() == null || dto.getJobId() == null || dto.getResumeId() == null) {
            throw new BizException(ErrorCode.APPLICATION_RESUME_REQUIRED, "申请参数不完整");
        }

        JobInfo jobInfo = jobInfoRepository.selectById(dto.getJobId());
        if (jobInfo == null) {
            throw new BizException(ErrorCode.JOB_NOT_FOUND, "职位不存在");
        }

        ResumeInfo resumeInfo = resumeInfoRepository.selectById(dto.getResumeId());
        if (resumeInfo == null) {
            throw new BizException(ErrorCode.NOT_FOUND, "简历不存在");
        }
        if (!dto.getUserId().equals(resumeInfo.getUserId())) {
            throw new BizException(ErrorCode.PARAM_INVALID, "无法使用该简历申请");
        }

        // 修改检查逻辑：只有当存在相同简历和职位的申请且状态为APPLIED时才阻止提交
        JobApplication existingApplication = jobApplicationRepository.selectOne(new LambdaQueryWrapper<JobApplication>()
                .eq(JobApplication::getUserId, dto.getUserId())
                .eq(JobApplication::getJobId, dto.getJobId())
                .eq(JobApplication::getResumeId, dto.getResumeId())
                .eq(JobApplication::getStatus, 1));
                
        if (existingApplication != null) {
            throw new BizException(ErrorCode.APPLICATION_ALREADY_EXISTS, "已投递过该职位");
        }

        JobApplication entity = new JobApplication();
        entity.setUserId(dto.getUserId());
        entity.setJobId(dto.getJobId());
        entity.setResumeId(dto.getResumeId());
        entity.setStatus(1);
        entity.setApplyTime(LocalDateTime.now());
        entity.setUpdateTime(LocalDateTime.now());
        entity.setDeleteFlag(0); // 添加逻辑删除标志，默认为0（未删除）
        
        // 添加简历快照
        try {
            String resumeSnapshot = objectMapper.writeValueAsString(resumeInfo);
            entity.setResumeSnapshot(resumeSnapshot);
        } catch (Exception e) {
            // 即使快照创建失败，也不应该阻止申请提交
            // 可以记录日志，但不应该抛出异常中断申请流程
            e.printStackTrace();
        }

        jobApplicationRepository.insert(entity);
        return entity.getApplicationId();
    }

    @Override
    public IPage<JobApplicationVO> pageMyApplications(Page<JobApplicationVO> page, Long userId, List<Integer> status) {
        Page<JobApplication> entityPage = new Page<>(page.getCurrent(), page.getSize());
        
        LambdaQueryWrapper<JobApplication> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(JobApplication::getUserId, userId)
                   .eq(JobApplication::getDeleteFlag, 0); // 只查询未删除的记录
        
        if (status != null && !status.isEmpty()) {
            queryWrapper.in(JobApplication::getStatus, status);
        }
        
        IPage<JobApplication> res = jobApplicationRepository.selectPage(entityPage, queryWrapper);

        Page<JobApplicationVO> voPage = new Page<>(res.getCurrent(), res.getSize(), res.getTotal());
        voPage.setRecords(res.getRecords().stream().map(entity -> {
            JobApplicationVO vo = new JobApplicationVO();
            BeanUtils.copyProperties(entity, vo);
            JobInfo jobInfo = jobInfoRepository.selectById(entity.getJobId());
            if (jobInfo != null) {
                vo.setJobTitle(jobInfo.getJobName());
                vo.setCompanyId(jobInfo.getCompanyId());
                vo.setPublishStatus(jobInfo.getPublishStatus());
                // 获取公司名称
                if (jobInfo.getCompanyId() != null) {
                    CompanyInfo companyInfo = companyInfoRepository.selectById(jobInfo.getCompanyId());
                    if (companyInfo != null) {
                        vo.setCompanyName(companyInfo.getCompanyName());
                    }
                }
            }
            return vo;
        }).toList());
        return voPage;
    }

    @Override
    public IPage<JobApplicationEmployerVO> pageCompanyApplications(Page<JobApplicationEmployerVO> page, Long companyId, List<Integer> status, List<Integer> excludeStatus) {
        Page<JobApplication> entityPage = new Page<>(page.getCurrent(), page.getSize());
        
        LambdaQueryWrapper<JobApplication> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(JobApplication::getDeleteFlag, 0); // 只查询未删除的记录
        
        if (status != null && !status.isEmpty()) {
            queryWrapper.in(JobApplication::getStatus, status);
        }
        
        // 处理排除状态
        if (excludeStatus != null && !excludeStatus.isEmpty()) {
            queryWrapper.notIn(JobApplication::getStatus, excludeStatus);
        }
        
        IPage<JobApplication> res = jobApplicationRepository.selectPage(entityPage, queryWrapper);

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

    public IPage<JobApplicationEmployerVO> pageCompanyApplications(Page<JobApplicationEmployerVO> page, Long companyId, List<Integer> status) {
        return pageCompanyApplications(page, companyId, status, Arrays.asList(4));
    }

    @Override
    public java.util.List<JobApplicationEmployerVO> listJobApplications(Long jobId) {
        List<JobApplication> list = jobApplicationRepository.selectList(new LambdaQueryWrapper<JobApplication>()
                .eq(JobApplication::getJobId, jobId)
                .eq(JobApplication::getDeleteFlag, 0)); // 只查询未删除的记录
        return buildEmployerVOs(list);
    }

    @Override
    public JobApplicationEmployerVO getApplicationById(Long applicationId) {
        JobApplication application = jobApplicationRepository.selectById(applicationId);
        if (application == null || application.getDeleteFlag() == 1) {
            return null;
        }
        
        List<JobApplication> applications = new ArrayList<>();
        applications.add(application);
        List<JobApplicationEmployerVO> vos = buildEmployerVOs(applications);
        return vos.isEmpty() ? null : vos.get(0);
    }

    private List<JobApplicationEmployerVO> buildEmployerVOs(List<JobApplication> applications) {
        if (applications == null || applications.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        // 过滤掉已删除的申请
        applications = applications.stream()
                .filter(app -> app.getDeleteFlag() == 0)
                .collect(Collectors.toList());
            
        return applications.stream().map(entity -> {
            JobApplicationEmployerVO vo = new JobApplicationEmployerVO();
            BeanUtils.copyProperties(entity, vo);
            
            JobInfo jobInfo = jobInfoRepository.selectById(entity.getJobId());
            if (jobInfo != null) {
                vo.setJobTitle(jobInfo.getJobName());
            }

            // 使用简历快照而不是直接查询简历
            if (entity.getResumeSnapshot() != null && !entity.getResumeSnapshot().isEmpty()) {
                try {
                    ResumeInfo resumeInfo = objectMapper.readValue(entity.getResumeSnapshot(), ResumeInfo.class);
                    if (resumeInfo != null) {
                        vo.setResumeTitle(resumeInfo.getResumeName());
                        vo.setUserId(resumeInfo.getUserId());
                        // 设置申请人姓名为简历中的姓名
                        vo.setUserName(resumeInfo.getName());
                        // 设置电话和邮箱
                        vo.setPhone(resumeInfo.getPhone());
                        vo.setEmail(resumeInfo.getEmail());
                        // 设置快照内容
                        vo.setResumeSnapshot(entity.getResumeSnapshot());
                    }
                } catch (Exception e) {
                    // 如果解析快照失败，则尝试直接查询
                    ResumeInfo resumeInfo = resumeInfoRepository.selectById(entity.getResumeId());
                    if (resumeInfo != null) {
                        vo.setResumeTitle(resumeInfo.getResumeName());
                        vo.setUserId(resumeInfo.getUserId());
                        // 设置申请人姓名为简历中的姓名
                        vo.setUserName(resumeInfo.getName());
                        // 设置电话和邮箱
                        vo.setPhone(resumeInfo.getPhone());
                        vo.setEmail(resumeInfo.getEmail());
                    }
                }
            } else {
                // 如果没有快照，则回退到直接查询
                ResumeInfo resumeInfo = resumeInfoRepository.selectById(entity.getResumeId());
                if (resumeInfo != null) {
                    vo.setResumeTitle(resumeInfo.getResumeName());
                    vo.setUserId(resumeInfo.getUserId());
                    // 设置申请人姓名为简历中的姓名
                    vo.setUserName(resumeInfo.getName());
                    // 设置电话和邮箱
                    vo.setPhone(resumeInfo.getPhone());
                    vo.setEmail(resumeInfo.getEmail());
                }
            }
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public boolean updateStatus(Long applicationId, Integer status, String reason) {
        if (applicationId == null || status == null) {
            throw new BizException(ErrorCode.APPLICATION_STATUS_INVALID, "状态更新参数不完整");
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
            throw new BizException(ErrorCode.PARAM_MISSING, "参数不完整");
        }

        JobApplication application = jobApplicationRepository.selectById(applicationId);
        if (application == null) {
            throw new BizException(ErrorCode.APPLICATION_NOT_FOUND, "申请记录不存在");
        }

        if (!userId.equals(application.getUserId())) {
            throw new BizException(ErrorCode.APPLICATION_OWNER_MISMATCH, "无权操作此申请");
        }

        LambdaUpdateWrapper<JobApplication> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(JobApplication::getApplicationId, applicationId)
                .set(JobApplication::getStatus, 4)
                .set(JobApplication::getUpdateTime, LocalDateTime.now());
        int rows = jobApplicationRepository.update(null, wrapper);
        return rows > 0;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteApplication(Long userId, Long jobId, Long resumeId) {
        if (userId == null || jobId == null || resumeId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "删除申请参数不完整");
        }
        
        // 使用 LambdaUpdateWrapper 直接更新，绕过 MyBatis Plus 逻辑删除拦截
        LambdaUpdateWrapper<JobApplication> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.set(JobApplication::getDeleteFlag, 1)
                .eq(JobApplication::getUserId, userId)
                .eq(JobApplication::getJobId, jobId)
                .eq(JobApplication::getResumeId, resumeId)
                .eq(JobApplication::getDeleteFlag, 0);
        jobApplicationRepository.update(null, updateWrapper);
        // 无论是否有记录被更新，都认为删除操作成功（幂等）
        return true;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long restoreApplication(Long userId, Long jobId, Long resumeId) {
        if (userId == null || jobId == null || resumeId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "恢复申请参数不完整");
        }

        // 先尝试恢复已逻辑删除的申请记录
        // 使用原生SQL更新，因为MyBatis Plus的逻辑删除机制会干扰对deleteFlag=1的记录的查询
        int recovered = jobApplicationRepository.updateDeletedApplicationToActive(userId, jobId, resumeId);
        if (recovered > 0) {
            // 恢复成功，直接返回任意一条记录的 ID（这里简单重新查一遍）
            JobApplication exist = jobApplicationRepository.selectOne(new LambdaQueryWrapper<JobApplication>()
                    .eq(JobApplication::getUserId, userId)
                    .eq(JobApplication::getJobId, jobId)
                    .eq(JobApplication::getResumeId, resumeId)
                    .eq(JobApplication::getDeleteFlag, 0));
            return exist != null ? exist.getApplicationId() : null;
        }

        // 判断是否已存在有效申请
        Long count = jobApplicationRepository.selectCount(new LambdaQueryWrapper<JobApplication>()
                .eq(JobApplication::getUserId, userId)
                .eq(JobApplication::getJobId, jobId)
                .eq(JobApplication::getResumeId, resumeId)
                .eq(JobApplication::getDeleteFlag, 0));
        if (count != null && count > 0) {
            // 已有有效申请，直接返回其中一条的 ID
            JobApplication exist = jobApplicationRepository.selectOne(new LambdaQueryWrapper<JobApplication>()
                    .eq(JobApplication::getUserId, userId)
                    .eq(JobApplication::getJobId, jobId)
                    .eq(JobApplication::getResumeId, resumeId)
                    .eq(JobApplication::getDeleteFlag, 0));
            return exist != null ? exist.getApplicationId() : null;
        }

        // 如果没有找到任何记录（包括已删除的），则返回null
        return null;
    }
}