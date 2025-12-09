package com.platform.ats.entity.resume;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("resume_info")
public class ResumeInfo {

    @TableId(type = IdType.AUTO)
    private Long resumeId;

    @TableField("user_id")
    private Long userId;

    @TableField("resume_name")
    private String resumeName;

    @TableField("name")
    private String name;

    @TableField("gender")
    // 1-男 2-女
    private Integer gender;

    @TableField("age")
    private Integer age;

    @TableField("education")
    private String education;

    @TableField("work_experience")
    private String workExperience;

    @TableField("skill")
    private String skill;

    @TableField("job_intention")
    private String jobIntention;

    @TableField("phone")
    private String phone;

    @TableField("email")
    private String email;

    @TableField( value = "create_time",fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time",fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableField("delete_flag")
    private Integer deleteFlag;
}