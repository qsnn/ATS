package com.platform.ats.entity.user.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户个人信息视图对象
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Data
@Schema(description = "用户个人信息VO")
public class UserProfileVO{

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
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 公司ID
     */
    private Long companyId;
    
    /**
     * 公司名称
     */
    private String companyName;

    /**
     * 求职者：投递数量
     */
    private Integer jobApplyCount;
    
    /**
     * HR：招聘职位数量
     */
    private Integer recruitmentCount;
    
    /**
     * 企业管理员：企业管理数量
     */
    private Integer companyManageCount;

    /**
     * JWT访问令牌
     */
    @Schema(description = "JWT访问令牌")
    private String token;
}