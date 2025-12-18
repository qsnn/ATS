package com.platform.ats.entity.company.dto;

import lombok.Data;

/**
 * 公司查询条件DTO
 */
@Data
public class CompanyQueryDTO {
    /**
     * 公司名称（模糊查询）
     */
    private String companyName;
    
    // 删除了status字段相关代码
}