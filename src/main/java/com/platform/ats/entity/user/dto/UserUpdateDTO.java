package com.platform.ats.entity.user.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 用户更新DTO
 */
@Data
public class UserUpdateDTO {

    @NotNull(message = "用户ID不能为空")
    private Long userId;
    private String phone;
    private String email;
    private Integer status;
    private Long companyId;
    private String department;
    private String position;
}