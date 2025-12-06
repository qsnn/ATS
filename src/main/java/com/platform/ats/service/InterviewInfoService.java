package com.platform.ats.service;

import com.platform.ats.entity.interview.InterviewInfo;
import com.platform.ats.entity.interview.vo.InterviewInfoVO;

import java.util.List;

public interface InterviewInfoService {
    InterviewInfoVO create(InterviewInfo interviewInfo);

    InterviewInfoVO update(InterviewInfo interviewInfo);

    boolean delete(Long arrangeId);

    List<InterviewInfoVO> getById(Long interviewerId);

    List<InterviewInfoVO> getByName(String intervieweeName);
}
