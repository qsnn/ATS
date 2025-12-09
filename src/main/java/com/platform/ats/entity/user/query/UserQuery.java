package com.platform.ats.entity.user.query;

import lombok.Data;

/**
 * 用户查询条件
 */
@Data
public class UserQuery {
    private String username;
    private Integer userType;
    private Integer status;
    private Long companyId;
    private String phone;
    private String email;
}