package com.platform.ats.entity.application.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 职位申请视图对象
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Data
public class JobApplicationVO {

    /**
     * 申请ID
     */
    private Long applicationId;

    /**
     * 职位ID
     */
    private Long jobId;

    /**
     * 职位标题
     */
    private String jobTitle;

    /**
     * 公司ID
     */
    private Long companyId;

    /**
     * 公司名称
     */
    private String companyName;

    /**
     * 简历ID
     */
    private Long resumeId;

    /**
     * 申请状态：1-APPLIED(已申请), 2-ACCEPTED(已接受), 3-REJECTED(已拒绝), 4-WITHDRAWN(已撤销)
     */
    private Integer status;

    /**
     * 申请时间
     */
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