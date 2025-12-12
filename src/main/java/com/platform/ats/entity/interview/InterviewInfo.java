package com.platform.ats.entity.interview;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("interview_info")
public class InterviewInfo {

    @TableId(type = IdType.AUTO)
    private Long arrangeId;

    @TableField("application_id")
    private Long applicationId;

    @TableField("interviewer_id")
    private Long interviewerId;

    @TableField("interviewee_id")
    private Long intervieweeId;

    @TableField("create_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime create_time;

    @TableField("update_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime update_time;

    @TableField("delete_flag")
    private Integer deleteFlag;

    @TableField("interviewee_name")
    private String intervieweeName;

    @TableField("interview_place")
    private String interviewPlace;

    @TableField("interview_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime interviewTime;

    /**
     * 面试状态：1-PREPARING_INTERVIEW, 2-INTERVIEW_ENDED, 3-ACCEPTED, 4-REJECTED
     */
    @TableField("status")
    private Integer status;
}