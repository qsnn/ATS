package com.platform.ats.entity.user.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户视图对象
 */
@Data
public class UserVO {

    private Long userId;
    private String username;
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

    // 权限相关信息
    private Boolean hasCompanyManagePermission;
    private Boolean hasRecruitmentPermission;
}