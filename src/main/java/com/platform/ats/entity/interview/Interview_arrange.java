package com.platform.ats.entity.interview;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("interview_arrange")
public class Interview_arrange {

    @TableId( value = "arrange_id", type = IdType.AUTO)
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
    private Integer interviewType;

    @TableField("online_meeting_software")
    private String onlineMeetingSoftware;

    @TableField("online_meeting_no")
    private String onlineMeetingNo;

    @TableField("interview_address_id")
    private Long interviewAddressId;

    @TableField("remind_status")
    private Integer remindStatus;

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    @TableField("delete_flag")
    private Integer deleteFlag;
}
