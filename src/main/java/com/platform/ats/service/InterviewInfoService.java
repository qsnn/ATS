package com.platform.ats.service;

import com.platform.ats.entity.interview.InterviewInfo;
import com.platform.ats.entity.interview.vo.InterviewInfoVO;
import com.platform.ats.entity.interview.vo.InterviewScheduleVO;

import java.util.List;

public interface InterviewInfoService {
    InterviewInfoVO create(InterviewInfo interviewInfo);

    InterviewInfoVO update(InterviewInfo interviewInfo);

    boolean delete(Long arrangeId);

    /**
     * 根据面试官ID查询该面试官安排的所有面试
     */
    List<InterviewInfoVO> getById(Long interviewerId);

    /**
     * 根据求职者用户ID查询该用户的所有面试安排
     */
    List<InterviewScheduleVO> getByUserId(Long userId);
}
