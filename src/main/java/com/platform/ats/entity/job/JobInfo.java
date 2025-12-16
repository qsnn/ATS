package com.platform.ats.entity.job;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.io.Serial;

/**
 * 职位信息表实体类
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Data
@TableName("job_info")
public class JobInfo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 职位ID，主键自增
     */
    @TableId(value = "job_id", type = IdType.AUTO)
    private Long jobId;

    /**
     * 公司ID
     */
    @TableField("company_id")
    private Long companyId;

    /**
     * 职位名称
     */
    @TableField("job_name")
    private String jobName;

    /**
     * 部门
     */
    @TableField("department")
    private String department;

    /**
     * 省份
     */
    @TableField("province")
    private String province;

    /**
     * 城市
     */
    @TableField("city")
    private String city;

    /**
     * 区域
     */
    @TableField("district")
    private String district;

    /**
     * 最低薪资
     */
    @TableField("salary_min")
    private BigDecimal salaryMin;

    /**
     * 最高薪资
     */
    @TableField("salary_max")
    private BigDecimal salaryMax;

    /**
     * 学历要求
     */
    @TableField("education")
    private Integer education;

    /**
     * 工作经验要求
     */
    @TableField("work_experience")
    private Integer workExperience;

    /**
     * 职位描述
     */
    @TableField("job_desc")
    private String jobDesc;

    /**
     * 发布人ID
     */
    @TableField("publisher_id")
    private Long publisherId;

    /**
     * 发布状态：0-草稿 1-已发布 2-已下架
     */
    @TableField("publish_status")
    private Integer publishStatus;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 删除标记：0-未删 1-已删
     */
    @TableLogic
    @TableField("delete_flag")
    private Integer deleteFlag;

}