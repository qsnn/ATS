package com.platform.ats.entity.resume.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 简历视图对象
 */
@Data
public class ResumeInfoVo {

    private Long resumeId;
    private Long userId;
    private String resumeName;
    private String name;
    private Integer gender; // 1-男 2-女
    private Integer age;
    private String education;
    private String workExperience;
    private String skill;
    private String jobIntention;
    private String phone;
    private String email;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

}