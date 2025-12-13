package com.platform.ats.entity.user;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统用户表实体类（MyBatis-Plus 版本）
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_user")
public class SysUser implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    @TableId(value = "user_id", type = IdType.AUTO)
    private Long userId;

    /**
     * 登录账号
     */
    @TableField("username")
    private String username;

    /**
     * 密码
     */
    @TableField("password")
    private String password;

    /**
     * 手机号
     */
    @TableField("phone")
    private String phone;

    /**
     * 邮箱
     */
    @TableField("email")
    private String email;

    /**
     * 用户类型：
     * 1-平台管理员 
     * 2-企业管理员 
     * 3-HR 
     * 4-求职者
     */
    @TableField("user_type")
    private Integer userType;

    /**
     * 账号状态：
     * 0-禁用 
     * 1-正常 
     * 2-待完善
     */
    @TableField("status")
    private Integer status;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    /**
     * 删除标记：
     * 0-未删 
     * 1-已删
     */
    @TableLogic
    @TableField("delete_flag")
    private Integer deleteFlag;

    /**
     * 所属企业ID
     */
    @TableField("company_id")
    private Long companyId;

    /**
     * 判断用户是否被禁用
     * 
     * @return true-禁用，false-未禁用
     */
    public boolean isDisabled() {
        return UserStatus.DISABLED.getCode().equals(status);
    }

}