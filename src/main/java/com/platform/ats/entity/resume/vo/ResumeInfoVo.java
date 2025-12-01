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
    private String realName;
    private Integer gender; // 0-男 1-女
    private Integer age;
    private String education;
    private String workExperience;
    private String skill;
    private String workHistory;
    private String educationHistory;
    private String jobIntention;
    private String resumeAttachment;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

}
