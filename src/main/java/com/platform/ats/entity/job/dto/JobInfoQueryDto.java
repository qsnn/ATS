package com.platform.ats.entity.job.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 职位查询参数数据传输对象
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Data
public class JobInfoQueryDto implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 职位ID
     */
    private Long jobId;

    /**
     * 职位名称
     */
    private String jobName;
    
    /**
     * 城市
     */
    private String city;
    
    /**
     * 学历要求
     */
    private Integer education;
    
    /**
     * 工作经验要求
     */
    private Integer workExperience;
    
    /**
     * 发布状态
     */
    private Integer publishStatus;
    
    /**
     * 公司ID
     */
    private Long companyId;
    
    /**
     * 最低薪资筛选
     */
    private BigDecimal salaryMin;
    
    /**
     * 最高薪资筛选
     */
    private BigDecimal salaryMax;
    
    /**
     * 排序字段
     */
    private String orderBy;
    
    /**
     * 排序方向
     */
    private String orderDirection;
}