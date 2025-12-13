package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.application.JobApplication;
import com.platform.ats.entity.interview.InterviewInfo;
import com.platform.ats.entity.interview.vo.InterviewInfoVO;
import com.platform.ats.entity.interview.vo.InterviewScheduleVO;
import com.platform.ats.entity.resume.ResumeInfo;
import com.platform.ats.repository.InterviewInfoRepository;
import com.platform.ats.repository.JobApplicationRepository;
import com.platform.ats.repository.ResumeInfoRepository;
import com.platform.ats.service.InterviewInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 面试信息服务实现类
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Service
@RequiredArgsConstructor
public class InterviewInfoServiceImpl extends ServiceImpl<InterviewInfoRepository, InterviewInfo> implements InterviewInfoService {

    private final InterviewInfoRepository interviewInfoRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final ResumeInfoRepository resumeInfoRepository;

    /**
     * 创建面试信息
     * 
     * @param interviewInfo 面试信息实体
     * @return 面试信息视图对象
     */
    @Override
    public InterviewInfoVO create(InterviewInfo interviewInfo) {
        if (interviewInfo == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试信息不能为空");
        }
        if (interviewInfo.getInterviewerId() == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试官ID不能为空");
        }
        if (interviewInfo.getApplicationId() == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "申请ID不能为空");
        }

        // 通过applicationId获取申请信息，进而获取简历信息和用户ID
        JobApplication application = jobApplicationRepository.selectById(interviewInfo.getApplicationId());
        // 检查申请是否存在且未被删除
        if (application == null || application.getDeleteFlag() == 1) {
            throw new BizException(ErrorCode.NOT_FOUND, "面试关联的投递记录不存在");
        }

        // 获取简历信息以填充面试者姓名
        ResumeInfo resume = resumeInfoRepository.selectById(application.getResumeId());
        if (resume != null) {
            interviewInfo.setIntervieweeName(resume.getName());
        }

        // 设置面试者ID
        interviewInfo.setIntervieweeId(application.getUserId());

        interviewInfo.setCreate_time(LocalDateTime.now());
        interviewInfo.setUpdate_time(LocalDateTime.now());
        interviewInfo.setDeleteFlag(0);
        interviewInfo.setStatus(1);

        interviewInfoRepository.insert(interviewInfo);

        // 更新申请状态为ACCEPTED
        JobApplication updatedApplication = new JobApplication();
        updatedApplication.setApplicationId(interviewInfo.getApplicationId());
        updatedApplication.setStatus(2);
        jobApplicationRepository.updateById(updatedApplication);

        return toVO(interviewInfo);
    }

    /**
     * 更新面试信息
     * 
     * @param interviewInfo 面试信息实体
     * @return 面试信息视图对象
     */
    @Override
    public InterviewInfoVO update(InterviewInfo interviewInfo) {
        if (interviewInfo == null || interviewInfo.getArrangeId() == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试信息或ID不能为空");
        }

        InterviewInfo dbInterviewInfo = interviewInfoRepository.selectById(interviewInfo.getArrangeId());
        if (dbInterviewInfo == null) {
            throw new BizException(ErrorCode.NOT_FOUND, "未找到对应面试信息");
        }

        // 只更新允许更新的字段
        if (interviewInfo.getInterviewerId() != null) {
            dbInterviewInfo.setInterviewerId(interviewInfo.getInterviewerId());
        }
        if (interviewInfo.getInterviewTime() != null) {
            dbInterviewInfo.setInterviewTime(interviewInfo.getInterviewTime());
        }
        if (interviewInfo.getInterviewPlace() != null) {
            dbInterviewInfo.setInterviewPlace(interviewInfo.getInterviewPlace());
        }
        if (interviewInfo.getStatus() != null) {
            dbInterviewInfo.setStatus(interviewInfo.getStatus());
        }
        if (interviewInfo.getIntervieweeName() != null) {
            dbInterviewInfo.setIntervieweeName(interviewInfo.getIntervieweeName());
        }
        if (interviewInfo.getIntervieweeId() != null) {
            dbInterviewInfo.setIntervieweeId(interviewInfo.getIntervieweeId());
        }

        dbInterviewInfo.setUpdate_time(LocalDateTime.now());

        interviewInfoRepository.updateById(dbInterviewInfo);

        return toVO(dbInterviewInfo);
    }

    /**
     * 删除面试信息
     * 
     * @param arrangeId 面试安排ID
     * @return 是否删除成功
     */
    @Override
    public boolean delete(Long arrangeId) {
        if (arrangeId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试安排ID不能为空");
        }

        InterviewInfo dbInterviewInfo = interviewInfoRepository.selectById(arrangeId);
        if (dbInterviewInfo == null) {
            throw new BizException(ErrorCode.NOT_FOUND, "未找到对应面试信息");
        }

        // 软删除
        dbInterviewInfo.setDeleteFlag(1);
        dbInterviewInfo.setUpdate_time(LocalDateTime.now());

        interviewInfoRepository.updateById(dbInterviewInfo);

        return true;
    }

    /**
     * 根据面试官ID获取面试信息列表
     * 
     * @param interviewerId 面试官ID
     * @return 面试信息视图对象列表
     */
    @Override
    public List<InterviewInfoVO> getById(Long interviewerId) {
        if (interviewerId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试官ID不能为空");
        }
        List<InterviewInfo> interviewInfoList = interviewInfoRepository.selectList(new LambdaQueryWrapper<InterviewInfo>()
                .eq(InterviewInfo::getInterviewerId, interviewerId)
                .eq(InterviewInfo::getDeleteFlag, 0));

        List<InterviewInfoVO> interviewInfoVOList = new ArrayList<>();
        for (InterviewInfo interviewInfo : interviewInfoList) {
            InterviewInfoVO interviewInfoVO = toVO(interviewInfo);
            interviewInfoVOList.add(interviewInfoVO);
        }

        return interviewInfoVOList;
    }

    /**
     * 根据求职者用户ID获取面试信息列表
     * 
     * @param userId 用户ID
     * @return 面试安排视图对象列表
     */
    @Override
    public List<InterviewScheduleVO> getByUserId(Long userId) {
        if (userId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试者ID不能为空");
        }
        // 使用自定义 join 查询，返回带职位和公司信息的面试安排
        return interviewInfoRepository.selectScheduleByUserId(userId);
    }
    
    /**
     * 根据公司ID分页获取面试信息
     * 
     * @param page 分页参数
     * @param companyId 公司ID
     * @param status 状态
     * @return 面试安排视图对象分页结果
     */
    @Override
    public IPage<InterviewScheduleVO> getByCompanyId(Page<InterviewScheduleVO> page, Long companyId, String status) {
        return getByCompanyId(page, companyId, status, null);
    }

    /**
     * 根据公司ID分页获取面试信息（支持日期筛选）
     * 
     * @param page 分页参数
     * @param companyId 公司ID
     * @param status 状态
     * @param interviewDate 面试日期
     * @return 面试安排视图对象分页结果
     */
    @Override
    public IPage<InterviewScheduleVO> getByCompanyId(Page<InterviewScheduleVO> page, Long companyId, String status, String interviewDate) {
        if (companyId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "公司ID不能为空");
        }
        // 使用自定义 join 查询，返回带职位和面试者信息的面试安排
        return interviewInfoRepository.selectScheduleByCompanyId(page, companyId, status, interviewDate);
    }

    private InterviewInfoVO toVO(InterviewInfo entity) {
        InterviewInfoVO vo = new InterviewInfoVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}