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

    /**
     * 申请状态：1-APPLIED, 2-ACCEPTED, 3-REJECTED, 4-WITHDRAWN
     */
    private Integer status;

    private LocalDateTime applyTime;
    
    /**
     * 职位发布状态
     */
    private Integer publishStatus;
    
    /**
     * 简历快照（包含所有简历信息）
     */
    private String resumeSnapshot;
}