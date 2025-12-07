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

    // 操作人ID（企业端当前登录用户），可选
    @TableField("operator_id")
    private Long operatorId;

    // 简要标签/备注
    @TableField("tag")
    private String tag;

    // 为了前端展示和便于扩展，补充候选人基础信息字段（与接口文档保持一致）
    @TableField("name")
    private String name;

    @TableField("phone")
    private String phone;

    @TableField("email")
    private String email;

    @TableField("position")
    private String position;

    @TableField("note")
    private String note;

    // 入库时间：只在插入时自动填充，此后不再修改
    @TableField(value = "put_in_time", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime putInTime;

    // 更新时间：插入和更新时都会自动填充
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    @TableField("delete_flag")
    @TableLogic
    private Integer deleteFlag;
}
