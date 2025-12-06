package com.platform.ats.entity.application.dto;

import lombok.Data;

@Data
public class JobApplicationCreateDTO {

    private Long userId;

    private Long jobId;

    private Long resumeId;
}

