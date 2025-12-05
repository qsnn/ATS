package com.platform.ats.entity.interview.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class ResultVO {

    private Long resultId;

    private Long arrangeId;

    private String interviewEvaluation;

    private Integer interviewResult;

    private LocalDateTime resultTime;

    private Long hrId;

    private Integer deleteFlag;
}
