package com.platform.ats.entity.interview.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InterviewInfoVO {

    private Long arrangeId;

    private Long applicationId;

    private Long interviewerId;

    private Long intervieweeId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    private Integer deleteFlag;

    private String intervieweeName;

    private String interviewPlace;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime interviewTime;

    /**
     * 面试状态：1-PREPARING_INTERVIEW, 2-INTERVIEW_ENDED, 3-ACCEPTED, 4-REJECTED
     */
    private Integer status;
}