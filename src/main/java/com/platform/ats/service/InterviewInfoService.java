package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.interview.InterviewInfo;
import com.platform.ats.entity.interview.vo.InterviewInfoVO;
import com.platform.ats.entity.interview.vo.InterviewScheduleVO;

import java.util.List;

public interface InterviewInfoService {

    /**
     * 创建面试信息
     */
    InterviewInfoVO create(InterviewInfo interviewInfo);

    /**
     * 更新面试信息
     */
    InterviewInfoVO update(InterviewInfo interviewInfo);

    /**
     * 删除面试信息
     */
    boolean delete(Long arrangeId);

    /**
     * 根据面试官ID获取面试信息
     */
    List<InterviewInfoVO> getById(Long interviewerId);

    /**
     * 根据求职者用户ID获取面试信息
     */
    List<InterviewScheduleVO> getByUserId(Long userId);
    
    /**
     * 根据公司ID分页获取面试信息
     */
    IPage<InterviewScheduleVO> getByCompanyId(Page<InterviewScheduleVO> page, Long companyId, String status);
}