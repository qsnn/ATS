package com.platform.ats.entity.application.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * Employer视角的申请记录视图对象，包含职位和申请人基础信息
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Data
public class JobApplicationEmployerVO {

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
     * 用户ID
     */
    private Long userId;
    
    /**
     * 用户名
     */
    private String userName;
    
    /**
     * 电话
     */
    private String phone;
    
    /**
     * 邮箱
     */
    private String email;

    /**
     * 简历ID
     */
    private Long resumeId;
    
    /**
     * 简历标题
     */
    private String resumeTitle;

    /**
     * 状态
     */
    private String status;
    
    /**
     * 申请时间
     */
    private LocalDateTime applyTime;
    
    /**
     * 简历快照（包含所有简历信息）
     */
    private String resumeSnapshot;
}