package com.platform.ats.entity.user.dto;

import lombok.Data;

/**
 * 用户注册请求体
 */
@Data
public class UserRegisterDTO {

    private String username;

    private String password;

    private String realName;

    private String phone;

    private String email;
}