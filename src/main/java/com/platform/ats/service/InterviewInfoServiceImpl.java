package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
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
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class InterviewInfoServiceImpl extends ServiceImpl<InterviewInfoRepository, InterviewInfo> implements InterviewInfoService {

    private final InterviewInfoRepository interviewInfoRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final ResumeInfoRepository resumeInfoRepository;
    private final NotificationHelperService notificationHelperService;

    public InterviewInfoServiceImpl(InterviewInfoRepository interviewInfoRepository,
                                    JobApplicationRepository jobApplicationRepository,
                                    ResumeInfoRepository resumeInfoRepository,
                                    NotificationHelperService notificationHelperService) {
        this.interviewInfoRepository = interviewInfoRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.resumeInfoRepository = resumeInfoRepository;
        this.notificationHelperService = notificationHelperService;
    }

    /**
     * 创建面试信息
     * 
     * @param interviewInfo 面试信息实体
     * @return 面试信息视图对象
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public InterviewInfoVO create(InterviewInfo interviewInfo) {
        if (interviewInfo == null || interviewInfo.getApplicationId() == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "缺少必要的面试参数");
        }

        // 获取申请信息
        JobApplication application = jobApplicationRepository.selectById(interviewInfo.getApplicationId());
        if (application == null) {
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
        
        // 创建面试安排通知
        notificationHelperService.createInterviewArrangedNotice(interviewInfo);

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
            throw new BizException(ErrorCode.PARAM_MISSING, "缺少必要的面试参数");
        }

        InterviewInfo dbInterviewInfo = interviewInfoRepository.selectById(interviewInfo.getArrangeId());
        if (dbInterviewInfo == null) {
            throw new BizException(ErrorCode.NOT_FOUND, "面试记录不存在");
        }

        // 保存原始状态用于判断是否需要发送通知
        Integer originalStatus = dbInterviewInfo.getStatus();

        dbInterviewInfo.setUpdate_time(LocalDateTime.now());
        // 只更新非空字段
        if (interviewInfo.getInterviewTime() != null) {
            dbInterviewInfo.setInterviewTime(interviewInfo.getInterviewTime());
        }
        if (interviewInfo.getInterviewPlace() != null) {
            dbInterviewInfo.setInterviewPlace(interviewInfo.getInterviewPlace());
        }
        if (interviewInfo.getStatus() != null) {
            dbInterviewInfo.setStatus(interviewInfo.getStatus());
        }

        interviewInfoRepository.updateById(dbInterviewInfo);
        
        // 如果面试状态发生了变化，创建面试结果通知
        if (interviewInfo.getStatus() != null && 
            !interviewInfo.getStatus().equals(originalStatus) &&
            (interviewInfo.getStatus() == 3 || interviewInfo.getStatus() == 4)) { // 录取或未录取
            notificationHelperService.createInterviewResultNotice(dbInterviewInfo);
        }

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