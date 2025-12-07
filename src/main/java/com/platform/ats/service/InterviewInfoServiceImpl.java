package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.application.JobApplication;
import com.platform.ats.entity.interview.InterviewInfo;
import com.platform.ats.entity.interview.vo.InterviewInfoVO;
import com.platform.ats.entity.interview.vo.InterviewScheduleVO;
import com.platform.ats.repository.InterviewInfoRepository;
import com.platform.ats.repository.JobApplicationRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class InterviewInfoServiceImpl implements InterviewInfoService {

    private final InterviewInfoRepository interviewInfoRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public InterviewInfoServiceImpl(InterviewInfoRepository interviewInfoRepository,
                                     JobApplicationRepository jobApplicationRepository) {
        this.interviewInfoRepository = interviewInfoRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }

    @Override
    public InterviewInfoVO create(InterviewInfo interviewInfo) {
        // 参数校验
        if (interviewInfo == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试信息不能为空");
        }

        // 通过 deliveryId 反查投递记录，填充面试者ID
        if (interviewInfo.getDeliveryId() == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "投递记录ID不能为空");
        }
        JobApplication application = jobApplicationRepository.selectById(interviewInfo.getDeliveryId());
        if (application == null) {
            throw new BizException(ErrorCode.APPLICATION_NOT_FOUND, "对应的投递记录不存在");
        }
        interviewInfo.setIntervieweeId(application.getUserId());

        interviewInfo.setArrangeId(null);
        interviewInfo.setDeleteFlag(0);

        interviewInfoRepository.insert(interviewInfo);

        InterviewInfoVO interviewInfoVO = new InterviewInfoVO();
        BeanUtils.copyProperties(interviewInfo, interviewInfoVO);
        return interviewInfoVO;
    }

    @Override
    public InterviewInfoVO update(InterviewInfo interviewInfo) {
        // 参数校验
        if (interviewInfo == null || interviewInfo.getArrangeId() == null) {
            throw new BizException(ErrorCode.INTERVIEW_NOT_FOUND, "面试信息或安排ID不能为空");
        }

        int rows = interviewInfoRepository.updateById(interviewInfo);
        if (rows == 0) {
            throw new BizException(ErrorCode.INTERVIEW_NOT_FOUND, "面试安排不存在或更新失败");
        }

        InterviewInfo updatedInterviewInfo = interviewInfoRepository.selectById(interviewInfo.getArrangeId());
        InterviewInfoVO interviewInfoVO = new InterviewInfoVO();
        BeanUtils.copyProperties(updatedInterviewInfo, interviewInfoVO);
        return interviewInfoVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean delete(Long arrangeId) {
        if (arrangeId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "安排ID不能为空");
        }

        UpdateWrapper<InterviewInfo> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("arrange_id", arrangeId)
                .set("delete_flag", 1);

        int result = interviewInfoRepository.update(null, updateWrapper);
        if (result == 0) {
            throw new BizException(ErrorCode.INTERVIEW_NOT_FOUND, "面试安排不存在或删除失败");
        }

        return true;
    }

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

    @Override
    public List<InterviewScheduleVO> getByUserId(Long userId) {
        if (userId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试者ID不能为空");
        }
        // 使用自定义 join 查询，返回带职位和公司信息的面试安排
        return interviewInfoRepository.selectScheduleByUserId(userId);
    }

    private InterviewInfoVO toVO(InterviewInfo entity) {
        InterviewInfoVO vo = new InterviewInfoVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}
