package com.platform.ats.entity.interview.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 面试安排视图对象，包含职位和公司等信息
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Data
public class InterviewScheduleVO {

    /**
     * 安排ID
     */
    private Long arrangeId;

    /**
     * 申请ID
     */
    private Long applicationId;

    /**
     * 职位ID
     */
    private Long jobId;

    /**
     * 公司ID
     */
    private Long companyId;

    /** 
     * 职位名称 
     */
    private String jobName;

    /** 
     * 公司名称 
     */
    private String companyName;

    /** 
     * 面试官ID 
     */
    private Long interviewerId;

    /** 
     * 面试者ID 
     */
    private Long intervieweeId;

    /** 
     * 面试地点 
     */
    private String interviewPlace;

    /** 
     * 面试时间 
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime interviewTime;

    /** 
     * 面试者姓名 
     */
    private String intervieweeName;

    /** 
     * 当前面试状态：从职位申请或面试结果推导 
     */
    private Integer status;
    
    /** 
     * 职位发布状态 
     */
    private Integer publishStatus;
    
    /** 
     * 简历ID 
     */
    private Long resumeId;
    
    /** 
     * 简历快照 
     */
    private String resumeSnapshot;
}