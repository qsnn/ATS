package com.platform.ats.entity.user.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户视图对象
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Data
public class UserVO {

    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 电话
     */
    private String phone;
    
    /**
     * 邮箱
     */
    private String email;
    
    /**
     * 用户类型
     */
    private Integer userType;
    
    /**
     * 用户类型描述
     */
    private String userTypeDesc;
    
    /**
     * 状态
     */
    private Integer status;
    
    /**
     * 状态描述
     */
    private String statusDesc;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    /**
     * 公司ID
     */
    private Long companyId;
    
    /**
     * 公司名称
     */
    private String companyName;

    /**
     * 是否有公司管理权限
     */
    private Boolean hasCompanyManagePermission;
    
    /**
     * 是否有招聘权限
     */
    private Boolean hasRecruitmentPermission;
}