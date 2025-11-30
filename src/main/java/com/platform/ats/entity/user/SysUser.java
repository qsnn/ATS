package com.platform.ats.entity.user;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

/**
 * <p>
 * 系统用户表
 * </p>
 *
 * @author
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_user")
public class SysUser {

    @TableId(value = "user_id", type = IdType.AUTO)
    @NotNull(message = "用户ID不能为空")
    private Long userId;

    @TableField(value = "username")
    @NotNull(message = "用户名不能为空")
    @Size(min = 2, max = 50, message = "用户名长度应在2到50个字符之间")
    private String username;

    /**
     * 密码
     */
    @NotNull(message = "密码不能为空")
    @Size(min = 6, max = 100, message = "密码长度应在6到100个字符之间")
    private String password;

    /**
     * 真实姓名
     */
    @NotNull(message = "真实姓名不能为空")
    @Size(min = 2, max = 50, message = "真实姓名长度应在2到50个字符之间")
    private String realName;

    /**
     * 手机号
     */
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    /**
     * 邮箱
     */
    @Email(message = "邮箱格式不正确")
    private String email;

    /**
     * 用户类型：1-平台管理员 2-企业管理员 3-HR 4-求职者
     */
    @NotNull(message = "用户类型不能为空")
    @Min(value = 1, message = "用户类型最小值为1")
    @Max(value = 4, message = "用户类型最大值为4")
    private Integer userType;

    /**
     * 账号状态：0-禁用 1-正常 2-待完善
     */
    @NotNull(message = "账号状态不能为空")
    @Min(value = 0, message = "账号状态最小值为0")
    @Max(value = 2, message = "账号状态最大值为2")
    private Integer status;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    /**
     * 删除标记：0-未删 1-已删
     */
    @TableLogic
    @NotNull(message = "删除标记不能为空")
    @Min(value = 0, message = "删除标记最小值为0")
    @Max(value = 1, message = "删除标记最大值为1")
    private Integer deleteFlag;

    /**
     * 所属企业ID（关联company_info.company_id，企业管理员和HR必填，求职者和管理员为NULL）
     */
    @TableField(value = "company_id")
    @Min(value = 0, message = "公司ID不能为负数")
    private Long companyId;

    /**
     * 所属部门
     */
    @TableField(value = "department")
    @Size(max = 100, message = "所属部门长度不能超过100个字符")
    private String department;

    /**
     * 职位
     */
    @TableField(value = "position")
    @Size(max = 100, message = "职位长度不能超过100个字符")
    private String position;
}
