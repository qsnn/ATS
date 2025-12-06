package com.platform.ats.entity.application.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobApplicationVO {

    private Long applicationId;

    private Long jobId;

    private String jobTitle;

    private Long companyId;

    private String companyName;

    private Long resumeId;

    private String status;

    private LocalDateTime applyTime;
}

