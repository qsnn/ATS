package com.platform.ats.entity.application.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * Employer 视角的申请记录 VO，包含职位和申请人基础信息
 */
@Data
public class JobApplicationEmployerVO {

    private Long applicationId;
    private Long jobId;
    private String jobTitle;

    private Long userId;
    private String userName;
    private String phone;
    private String email;

    private Long resumeId;
    private String resumeTitle;

    private String status;
    private LocalDateTime applyTime;
    
    /**
     * 简历快照（包含所有简历信息）
     */
    private String resumeSnapshot;
}