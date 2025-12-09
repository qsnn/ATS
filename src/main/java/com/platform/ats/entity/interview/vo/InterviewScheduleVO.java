package com.platform.ats.entity.interview.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 求职者侧面试列表富VO，包含职位和公司等信息
 */
@Data
public class InterviewScheduleVO {

    private Long arrangeId;

    private Long deliveryId;

    private Long jobId;

    private Long companyId;

    /** 职位名称 */
    private String jobName;

    /** 公司名称 */
    private String companyName;

    /** 面试官ID */
    private Long interviewerId;

    /** 面试者ID */
    private Long intervieweeId;

    /** 面试详情 */
    private String interviewIntro;

    /** 面试者姓名 */
    private String intervieweeName;

    /** 当前面试状态：从职位申请或面试结果推导 */
    private String status;
    
    /** 职位发布状态 */
    private Integer publishStatus;
}