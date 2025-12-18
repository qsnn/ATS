package com.platform.ats.entity.job.dto;

import com.platform.ats.entity.job.JobInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.io.Serial;

/**
 * 职位详情（包含关联信息）数据传输对象
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class JobInfoDetailDto extends JobInfo {
    @Serial
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