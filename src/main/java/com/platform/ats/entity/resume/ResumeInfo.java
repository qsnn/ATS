package com.platform.ats.entity.resume;

import com.baomidou.mybatisplus.annotation.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("resume_info")
public class ResumeInfo {

    @TableId(type = IdType.AUTO)
    private Long resumeId;

    @TableField("user_id")
    @NotNull(message = "用户ID不能为空")
    private Long userId;

    @TableField("resume_name")
    @NotNull(message = "简历名称不能为空")
    private String resumeName;

    @TableField("real_name")
    @NotNull(message = "真实姓名不能为空")
    private String realName;

    @TableField("gender")
    @NotNull(message = "性别不能为空")
    // 0-男 1-女
    private Integer gender;

    @TableField("age")
    private Integer age;

    @TableField("education")
    @NotNull(message = "学历不能为空")
    private String education;

    @TableField("work_experience")
    @NotNull(message = "工作经验不能为空")
    private String workExperience;

    @TableField("skill")
    @NotNull(message = "掌握技能不能为空")
    private String skill;

    @TableField("work_history")
    @NotNull(message = "工作经历不能为空")
    private String workHistory;

    @TableField("education_history")
    @NotNull(message = "教育经历不能为空")
    private String educationHistory;

    @TableField("job_intention")
    @NotNull(message = "求职意向不能为空")
    private String jobIntention;

    @TableField("resume_attachment")
    @NotNull(message = "简历附件不能为空")
    private String resumeAttachment;

    @TableField( value = "create_time",fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time",fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableField("delete_flag")
    private Integer deleteFlag;
}
