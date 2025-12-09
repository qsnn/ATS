package com.platform.ats.entity.user.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户个人信息VO
 */
@Data
public class UserProfileVO {

    private Long userId;
    private String username;
    private String realName;
    private String phone;
    private String email;
    private Integer userType;
    private String userTypeDesc;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    private Long companyId;
    private String companyName;

    // 统计信息
    private Integer jobApplyCount;      // 求职者：投递数量
    private Integer recruitmentCount;   // HR：招聘职位数量
    private Integer companyManageCount; // 企业管理员：企业管理数量
}