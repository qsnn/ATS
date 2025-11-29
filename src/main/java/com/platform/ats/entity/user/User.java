package com.platform.ats.entity.user;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统用户表实体类（MyBatis-Plus 版本）
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户类型枚举
     */
    public enum UserType {
        PLATFORM_ADMIN(1, "平台管理员"),
        COMPANY_ADMIN(2, "企业管理员"),
        HR(3, "HR"),
        JOB_SEEKER(4, "求职者");

        private final Integer code;
        private final String desc;

        UserType(Integer code, String desc) {
            this.code = code;
            this.desc = desc;
        }

        public Integer getCode() {
            return code;
        }

        public String getDesc() {
            return desc;
        }

        public static UserType getByCode(Integer code) {
            for (UserType type : values()) {
                if (type.getCode().equals(code)) {
                    return type;
                }
            }
            return null;
        }
    }

    /**
     * 账号状态枚举
     */
    public enum UserStatus {
        DISABLED(0, "禁用"),
        NORMAL(1, "正常"),
        TO_BE_COMPLETED(2, "待完善");

        private final Integer code;
        private final String desc;

        UserStatus(Integer code, String desc) {
            this.code = code;
            this.desc = desc;
        }

        public Integer getCode() {
            return code;
        }

        public String getDesc() {
            return desc;
        }

        public static UserStatus getByCode(Integer code) {
            for (UserStatus status : values()) {
                if (status.getCode().equals(code)) {
                    return status;
                }
            }
            return null;
        }
    }

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
     * 真实姓名
     */
    @TableField("real_name")
    private String realName;

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
     * 用户类型：1\-平台管理员 2\-企业管理员 3\-HR 4\-求职者
     */
    @TableField("user_type")
    private Integer userType;

    /**
     * 账号状态：0\-禁用 1\-正常 2\-待完善
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
     * 删除标记：0\-未删 1\-已删
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
     * 所属部门
     */
    @TableField("department")
    private String department;

    /**
     * 职位
     */
    @TableField("position")
    private String position;

    // ========== 业务方法 ==========

    public boolean isCompanyUser() {
        return UserType.COMPANY_ADMIN.getCode().equals(userType)
                || UserType.HR.getCode().equals(userType);
    }

    public boolean isPlatformAdmin() {
        return UserType.PLATFORM_ADMIN.getCode().equals(userType);
    }

    public boolean isJobSeeker() {
        return UserType.JOB_SEEKER.getCode().equals(userType);
    }

    public String getUserTypeDesc() {
        UserType type = UserType.getByCode(userType);
        return type != null ? type.getDesc() : "未知";
    }

    public String getStatusDesc() {
        UserStatus userStatus = UserStatus.getByCode(status);
        return userStatus != null ? userStatus.getDesc() : "未知";
    }

    public boolean isNormal() {
        return UserStatus.NORMAL.getCode().equals(status);
    }

    public boolean isDisabled() {
        return UserStatus.DISABLED.getCode().equals(status);
    }

    public boolean needToComplete() {
        return UserStatus.TO_BE_COMPLETED.getCode().equals(status);
    }
}