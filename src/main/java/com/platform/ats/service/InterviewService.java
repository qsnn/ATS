package com.platform.ats.service;

import com.platform.ats.entity.interview.vo.AddressVO;
import com.platform.ats.entity.interview.vo.InterviewInfoVO;
import com.platform.ats.entity.interview.vo.ResultVO;
import com.platform.ats.entity.interview.vo.ArrangeVO;

import java.util.List;

public interface InterviewService {

    Long arrangeInterview(ArrangeVO arrangeVO);

    Long setInterviewAddress(AddressVO addressVO);

    void setInterviewResult(ResultVO resultVO);

    AddressVO getInterviewAddress(Long addressId);

    InterviewInfoVO getInterviewInfo(Long arrangeId);
}
