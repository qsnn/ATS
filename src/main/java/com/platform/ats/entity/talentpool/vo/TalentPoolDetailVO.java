package com.platform.ats.entity.talentpool.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 人才库富VO：包含候选人基本信息和联系方式
 */
@Data
public class TalentPoolDetailVO {

    private Long talentId;

    private Long resumeId;

    private Long companyId;

    private String tag;

    private Long operatorId;

    /** 候选人姓名（来自 resume_info.name） */
    private String candidateName;

    /** 求职意向/目标职位（来自 resume_info.job_intention） */
    private String position;

    /** 联系电话（来自 sys_user.phone） */
    private String phone;

    /** 邮箱（来自 sys_user.email） */
    private String email;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime putInTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;
}

