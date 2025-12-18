package com.platform.ats.entity.interview.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 面试信息视图对象
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Data
public class InterviewInfoVO {

    /**
     * 安排ID
     */
    private Long arrangeId;

    /**
     * 申请ID
     */
    private Long applicationId;

    /**
     * 面试官ID
     */
    private Long interviewerId;

    /**
     * 面试者ID
     */
    private Long intervieweeId;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    /**
     * 删除标记
     */
    private Integer deleteFlag;

    /**
     * 面试者姓名
     */
    private String intervieweeName;

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
     * 面试状态：
     * 1-PREPARING_INTERVIEW(准备面试)
     * 2-INTERVIEW_ENDED(面试结束)
     * 3-ACCEPTED(录取)
     * 4-REJECTED(未录取)
     */
    private Integer status;
}