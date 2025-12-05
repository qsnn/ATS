package com.platform.ats.entity.interview;

import com.baomidou.mybatisplus.annotation.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;


@Data
@TableName("interview_result")
public class Interview_result {

    @TableId(type = IdType.AUTO)
    private Long resultId;

    @TableField("arrange_id")
    @NotNull(message = "面试安排ID不能为空")
    private Long arrangeId;

    @TableField("interview_evaluation")
    private String interviewEvaluation;

    @TableField("interview_result")
    @NotNull(message = "面试结果不能为空")
    private Integer interviewResult;

    @TableField(value = "result_time", fill = FieldFill.INSERT)
    private LocalDateTime resultTime;

    @TableField("hr_id")
    @NotNull(message = "录入HR ID不能为空")
    private Long hrId;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableField("delete_flag")
    private Integer deleteFlag;
}
