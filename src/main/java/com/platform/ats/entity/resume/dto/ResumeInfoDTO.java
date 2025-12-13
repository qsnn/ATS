package com.platform.ats.entity.resume.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 简历数据传输对象
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Data
public class ResumeInfoDTO {

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
    private Integer education;
    
    /**
     * 工作经验
     */
    private Integer workExperience;
    
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

    /**
     * 删除标记
     */
    private Integer deleteFlag;

    /**
     * 性别描述：根据gender生成的描述，例如"男"或"女"
     */
    private String genderDesc;
}