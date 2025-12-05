package com.platform.ats.entity.job.dto;

import com.platform.ats.entity.job.JobInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 职位详情（包含关联信息） DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class JobInfoDetailDto extends JobInfo {
    private static final long serialVersionUID = 1L;

    /**
     * 企业名称
     */
    private String companyName;

    /**
     * 发布人用户名
     */
    private String publisherName;
}