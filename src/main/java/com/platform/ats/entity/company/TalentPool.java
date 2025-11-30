package com.platform.ats.entity.company;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("talent_pool")
public class TalentPool {

    @TableId(value = "talent_id", type = IdType.AUTO)
    private Long talentId;

    @TableField("resume_id")
    @NotNull(message = "简历ID不能为空")
    private Long resumeId;

    @TableField("company_id")
    @NotNull(message = "企业ID不能为空")
    private Long companyId;

    @TableField("operator_id")
    @NotNull(message = "操作人ID不能为空")
    private Long operatorId;

    @TableField("tag")
    private String tag;

    @TableField(value = "put_in_time", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime putInTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    @TableField("delete_flag")
    private Integer deleteFlag;

}
