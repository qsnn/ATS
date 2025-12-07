package com.platform.ats.entity.company.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TalentPoolVO {

    private Long talentId;

    private Long resumeId;

    private Long companyId;

    private Long operatorId;

    private String tag;

    // 新增：候选人基础信息字段，便于前端直接展示
    private String name;

    private String phone;

    private String email;

    private String position;

    private String note;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime putInTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;
}