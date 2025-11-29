package com.platform.ats.entity.user.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

/**
 * 用户密码修改DTO
 */
@Data
public class UserPasswordDTO {

    @NotBlank(message = "原密码不能为空")
    private String oldPassword;

    @NotBlank(message = "新密码不能为空")
    private String newPassword;
}