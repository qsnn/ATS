package com.platform.ats.entity.user.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

/**
 * HR账户创建DTO
 */
@Data
public class HrCreateDTO {

    @NotNull(message = "企业ID不能为空")
    private Long companyId;
    
    private String contactPhone;
    private String contactEmail;
    
    private Integer count = 1; // 批量创建数量，默认为1
}