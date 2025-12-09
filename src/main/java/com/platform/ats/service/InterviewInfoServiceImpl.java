package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.interview.InterviewInfo;
import com.platform.ats.entity.interview.vo.InterviewInfoVO;
import com.platform.ats.entity.interview.vo.InterviewScheduleVO;
import com.platform.ats.repository.InterviewInfoRepository;
import com.platform.ats.service.InterviewInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewInfoServiceImpl extends ServiceImpl<InterviewInfoRepository, InterviewInfo> implements InterviewInfoService {

    private final InterviewInfoRepository interviewInfoRepository;

    @Override
    public InterviewInfoVO create(InterviewInfo interviewInfo) {
        if (interviewInfo == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试信息不能为空");
        }
        if (interviewInfo.getInterviewerId() == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试官ID不能为空");
        }
        if (interviewInfo.getDeliveryId() == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "投递ID不能为空");
        }

        interviewInfo.setCreate_time(LocalDateTime.now());
        interviewInfo.setUpdate_time(LocalDateTime.now());
        interviewInfo.setDeleteFlag(0);
        interviewInfo.setStatus("PREPARING_INTERVIEW");

        interviewInfoRepository.insert(interviewInfo);

        return toVO(interviewInfo);
    }

    @Override
    public InterviewInfoVO update(InterviewInfo interviewInfo) {
        if (interviewInfo == null || interviewInfo.getArrangeId() == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试信息或ID不能为空");
        }

        InterviewInfo dbInterviewInfo = interviewInfoRepository.selectById(interviewInfo.getArrangeId());
        if (dbInterviewInfo == null) {
            throw new BizException(ErrorCode.INTERVIEW_NOT_FOUND, "未找到对应面试信息");
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

        dbInterviewInfo.setUpdate_time(LocalDateTime.now());

        interviewInfoRepository.updateById(dbInterviewInfo);

        return toVO(dbInterviewInfo);
    }

    @Override
    public boolean delete(Long arrangeId) {
        if (arrangeId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "面试安排ID不能为空");
        }

        InterviewInfo dbInterviewInfo = interviewInfoRepository.selectById(arrangeId);
        if (dbInterviewInfo == null) {
            throw new BizException(ErrorCode.INTERVIEW_NOT_FOUND, "未找到对应面试信息");
        }

        // 软删除
        dbInterviewInfo.setDeleteFlag(1);
        dbInterviewInfo.setUpdate_time(LocalDateTime.now());

        interviewInfoRepository.updateById(dbInterviewInfo);

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