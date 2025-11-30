package com.platform.ats.entity.recruitment.interview;

import com.baomidou.mybatisplus.annotation.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("interview_arrange")
public class InterviewArrange implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "arrange_id", type = IdType.AUTO)
    private Long arrangeId;

    @TableField("delivery_id")
    @NotNull(message = "投递记录ID不能为空")
    private Long deliveryId;

    @TableField("interviewer_id")
    @NotNull(message = "面试官ID不能为空")
    private Long interviewerId;

    @TableField("interview_time")
    @NotNull(message = "面试时间不能为空")
    private LocalDateTime interviewTime;

    @TableField("interview_type")
    @NotNull(message = "面试形式不能为空")
    private Integer interviewType; // 1-线上 2-线下

    @TableField("online_meeting_software")
    @Size(max = 50, message = "线上会议软件名称长度不能超过50个字符")
    private String onlineMeetingSoftware;

    @TableField("online_meeting_no")
    @Size(max = 50, message = "线上会议号长度不能超过50个字符")
    private String onlineMeetingNo;

    @TableField("interview_address_id")
    private Long interviewAddressId;

    @TableField("remind_status")
    private Integer remindStatus = 0; // 0-未提醒 1-已提醒

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableField("delete_flag")
    @TableLogic
    private Integer deleteFlag = 0;
}
