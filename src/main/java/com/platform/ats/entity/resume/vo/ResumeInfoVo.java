package com.platform.ats.entity.resume.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 简历视图对象
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Data
public class ResumeInfoVo {

    /**
     * 简历ID
     */
    private Long resumeId;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 简历名称
     */
    private String resumeName;
    
    /**
     * 姓名
     */
    private String name;
    
    /**
     * 性别：1-男 2-女
     */
    private Integer gender;
    
    /**
     * 年龄
     */
    private Integer age;
    
    /**
     * 学历
     */
    private String education;
    
    /**
     * 工作经验
     */
    private String workExperience;
    
    /**
     * 技能
     */
    private String skill;
    
    /**
     * 求职意向
     */
    private String jobIntention;
    
    /**
     * 电话
     */
    private String phone;
    
    /**
     * 邮箱
     */
    private String email;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

}