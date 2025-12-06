package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.platform.ats.entity.interview.InterviewInfo;
import com.platform.ats.entity.interview.vo.InterviewInfoVO;
import com.platform.ats.repository.InterviewInfoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

public class InterviewInfoServiceImpl implements  InterviewInfoService {

    private final InterviewInfoRepository interviewInfoRepository;

    public InterviewInfoServiceImpl(InterviewInfoRepository interviewInfoRepository) {
        this.interviewInfoRepository = interviewInfoRepository;
    }
    @Override
    public InterviewInfoVO create(InterviewInfo interviewInfo) {
        // 参数校验
        if (interviewInfo == null) {
            throw new IllegalArgumentException("面试信息不能为空");
        }

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
            throw new IllegalArgumentException("面试信息或安排ID不能为空");
        }

        // 更新数据库
        int rows = interviewInfoRepository.updateById(interviewInfo);
        if (rows == 0) {
            throw new RuntimeException("面试安排不存在或更新失败");
        }

        // 返回更新后的VO对象
        InterviewInfo updatedInterviewInfo = interviewInfoRepository.selectById(interviewInfo.getArrangeId());
        InterviewInfoVO interviewInfoVO = new InterviewInfoVO();
        BeanUtils.copyProperties(updatedInterviewInfo, interviewInfoVO);
        return interviewInfoVO;
    }

    @Override
    @Transactional
    public boolean delete(Long arrangeId) {
        if (arrangeId == null) {
            return false;
        }

        // 使用软删除，将delete_flag设置为1
        UpdateWrapper<InterviewInfo> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("arrange_id", arrangeId)
                .set("delete_flag", 1);

        int result = interviewInfoRepository.update(null, updateWrapper);

        if (result == 0) {
            throw new RuntimeException("面试安排不存在或删除失败");
        }

        return true;
    }

    @Override
    public List<InterviewInfoVO> getById(Long interviewerId) {
        if (interviewerId == null) {
            throw new IllegalArgumentException("面试官ID不能为空");
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
    public List<InterviewInfoVO> getByName(String intervieweeName) {
        if (intervieweeName == null) {
            throw new IllegalArgumentException("面试者姓名不能为空");
        }
        List<InterviewInfo> interviewInfoList = interviewInfoRepository.selectList(new LambdaQueryWrapper<InterviewInfo>()
                .eq(InterviewInfo::getIntervieweeName, intervieweeName)
                .eq(InterviewInfo::getDeleteFlag, 0));

        List<InterviewInfoVO> interviewInfoVOList = new ArrayList<>();
        for (InterviewInfo interviewInfo : interviewInfoList) {
            InterviewInfoVO interviewInfoVO = toVO(interviewInfo);
            interviewInfoVOList.add(interviewInfoVO);
        }

        return interviewInfoVOList;
    }

    private InterviewInfoVO toVO(InterviewInfo entity) {
        InterviewInfoVO vo = new InterviewInfoVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }

}
