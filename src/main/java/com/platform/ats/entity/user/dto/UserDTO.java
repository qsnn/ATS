package com.platform.ats.entity.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户数据传输对象
 */
@Data
public class UserDTO {

    private Long userId;
    private String username;
    private String realName;
    private String phone;
    private String email;
    private Integer userType;
    private String userTypeDesc;
    private Integer status;
    private String statusDesc;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    private Long companyId;
    private String companyName;
    private String department;
    private String position;

    // 业务字段
    private Boolean isCompanyUser;
    private Boolean isPlatformAdmin;
    private Boolean isJobSeeker;
}