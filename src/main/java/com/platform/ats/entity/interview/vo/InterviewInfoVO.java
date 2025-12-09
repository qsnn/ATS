package com.platform.ats.entity.interview.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InterviewInfoVO {

    private Long arrangeId;

    private Long deliveryId;

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
     * 面试状态：PREPARING_INTERVIEW-准备面试, INTERVIEW_ENDED-面试结束, ACCEPTED-录取, REJECTED-未录取
     */
    private String status;
}