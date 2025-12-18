package com.platform.ats.entity.talentpool;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 人才库实体类
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Data
@TableName("talent_pool")
public class TalentPool {

    /**
     * 人才ID，主键自增
     */
    @TableId(value = "talent_id", type = IdType.AUTO)
    private Long talentId;

    /**
     * 简历ID
     */
    @TableField("resume_id")
    @NotNull(message = "简历ID不能为空")
    private Long resumeId;

    /**
     * 公司ID
     */
    @TableField("company_id")
    @NotNull(message = "企业ID不能为空")
    private Long companyId;

    /**
     * 简要标签/备注
     */
    @TableField("tag")
    private String tag;

    /**
     * 录入时间
     */
    @TableField(value = "put_in_time", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime putInTime;

    /**
     * 操作人ID（企业端当前登录用户）
     */
    @TableField("operator_id")
    @NotNull(message = "操作人ID不能为空")
    private Long operatorId;

    /**
     * 更新时间：插入和更新时都会自动填充
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    /**
     * 删除标记：0-未删 1-已删
     */
    @TableField("delete_flag")
    @TableLogic
    private Integer deleteFlag;
}