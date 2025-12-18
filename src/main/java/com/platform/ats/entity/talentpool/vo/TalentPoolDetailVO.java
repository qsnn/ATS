package com.platform.ats.entity.talentpool.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 人才库详情视图对象：包含候选人基本信息和联系方式
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Data
public class TalentPoolDetailVO {

    /**
     * 人才ID
     */
    private Long talentId;

    /**
     * 简历ID
     */
    private Long resumeId;

    /**
     * 公司ID
     */
    private Long companyId;

    /**
     * 标签
     */
    private String tag;

    /**
     * 操作人ID
     */
    private Long operatorId;

    /** 
     * 候选人姓名（来自 resume_info.name） 
     */
    private String candidateName;

    /** 
     * 求职意向/目标职位（来自 resume_info.job_intention） 
     */
    private String position;

    /** 
     * 联系电话（来自 sys_user.phone） 
     */
    private String phone;

    /** 
     * 邮箱（来自 sys_user.email） 
     */
    private String email;

    /**
     * 录入时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime putInTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;
}

