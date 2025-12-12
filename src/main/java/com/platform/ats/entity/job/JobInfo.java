package com.platform.ats.entity.job;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 职位信息表
 */
@Data
@TableName("job_info")
public class JobInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "job_id", type = IdType.AUTO)
    private Long jobId;

    @TableField("company_id")
    private Long companyId;

    @TableField("job_name")
    private String jobName;

    @TableField("department")
    private String department;

    @TableField("province")
    private String province;

    @TableField("city")
    private String city;

    @TableField("district")
    private String district;

    @TableField("salary_min")
    private BigDecimal salaryMin;

    @TableField("salary_max")
    private BigDecimal salaryMax;

    @TableField("education")
    private Integer education;

    @TableField("work_experience")
    private Integer workExperience;

    @TableField("job_desc")
    private String jobDesc;


    @TableField("publisher_id")
    private Long publisherId;

    @TableField("publish_status")
    private Integer publishStatus;

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    @TableField("delete_flag")
    private Integer deleteFlag;

}