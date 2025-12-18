package com.platform.ats.entity.resume;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 简历信息实体类
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Data
@TableName("resume_info")
public class ResumeInfo {

    /**
     * 简历ID，主键自增
     */
    @TableId(type = IdType.AUTO)
    private Long resumeId;

    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 简历名称
     */
    @TableField("resume_name")
    private String resumeName;

    /**
     * 姓名
     */
    @TableField("name")
    private String name;

    /**
     * 性别：1-男 2-女
     */
    @TableField("gender")
    private Integer gender;

    /**
     * 年龄
     */
    @TableField("age")
    private Integer age;

    /**
     * 学历
     */
    @TableField("education")
    private Integer education;

    /**
     * 工作经验
     */
    @TableField("work_experience")
    private Integer workExperience;

    /**
     * 技能
     */
    @TableField("skill")
    private String skill;

    /**
     * 求职意向
     */
    @TableField("job_intention")
    private String jobIntention;

    /**
     * 电话
     */
    @TableField("phone")
    private String phone;

    /**
     * 邮箱
     */
    @TableField("email")
    private String email;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 删除标记
     */
    @TableField("delete_flag")
    private Integer deleteFlag;
}