package com.platform.ats.entity.interview;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 面试信息实体类
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Data
@TableName("interview_info")
public class InterviewInfo {

    /**
     * 面试安排ID，主键自增
     */
    @TableId(type = IdType.AUTO)
    private Long arrangeId;

    /**
     * 申请ID
     */
    @TableField("application_id")
    private Long applicationId;

    /**
     * 面试官ID
     */
    @TableField("interviewer_id")
    private Long interviewerId;

    /**
     * 面试者ID
     */
    @TableField("interviewee_id")
    private Long intervieweeId;

    /**
     * 创建时间
     */
    @TableField("create_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime create_time;

    /**
     * 更新时间
     */
    @TableField("update_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime update_time;

    /**
     * 删除标记
     */
    @TableField("delete_flag")
    private Integer deleteFlag;

    /**
     * 面试者姓名
     */
    @TableField("interviewee_name")
    private String intervieweeName;

    /**
     * 面试地点
     */
    @TableField("interview_place")
    private String interviewPlace;

    /**
     * 面试时间
     */
    @TableField("interview_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime interviewTime;

    /**
     * 面试状态：
     * 1-PREPARING_INTERVIEW(准备面试)
     * 2-INTERVIEW_ENDED(面试结束)
     * 3-ACCEPTED(录取)
     * 4-REJECTED(未录取)
     */
    @TableField("status")
    private Integer status;
}