package com.platform.ats.entity.user.dto;

import lombok.Data;

/**
 * 密码重置验证DTO
 */
@Data
public class PasswordResetValidateDTO {
    private String username;
    private String phone;
    private String email;
    private String newPassword;
}