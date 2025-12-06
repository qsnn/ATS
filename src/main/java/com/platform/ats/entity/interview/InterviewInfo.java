package com.platform.ats.entity.interview;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("interview_info")
public class InterviewInfo {

    @TableId(type = IdType.AUTO)
    private Long arrangeId;

    @TableField("delivery_id")
    private Long deliveryId;

    @TableField("interviewer_id")
    private Long interviewerId;

    @TableField("create_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime create_time;

    @TableField("update_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime update_time;

    @TableField("delete_flag")
    private Integer deleteFlag;

    @TableField("interview_intro")
    @NotNull(message = "面试介绍不能为空")
    private String interviewIntro;

    @TableField("interviewee_name")
    @NotNull(message = "面试者姓名不能为空")
    private String intervieweeName;
}
