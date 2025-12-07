package com.platform.ats.entity.job.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 职位查询参数 DTO
 */
@Data
public class JobInfoQueryDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private String jobName;
    private String city;
    private String education;
    private String workExperience;
    private Integer publishStatus;
    private Long companyId;
    
    // 薪资筛选
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    
    // 排序字段
    private String orderBy;
    private String orderDirection;
}