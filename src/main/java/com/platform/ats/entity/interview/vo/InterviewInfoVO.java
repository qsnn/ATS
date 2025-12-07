package com.platform.ats.entity.interview.vo;

import lombok.Data;

@Data
public class InterviewInfoVO {

    private Long arrangeId;
    private Long deliveryId;
    private Long interviewerId;
    private Long intervieweeId;
    private String interviewIntro;
    private String intervieweeName;
}
