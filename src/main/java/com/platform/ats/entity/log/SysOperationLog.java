package com.platform.ats.entity.log;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统操作日志实体类
 */
@Data
@TableName("sys_operation_log")
public class SysOperationLog implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 日志ID
     */
    @TableId(value = "log_id", type = IdType.AUTO)
    private Long logId;

    /**
     * 操作人ID（关联sys_user.user_id）
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 操作人用户名
     */
    @TableField("username")
    private String username;

    /**
     * 操作模块（如：用户管理、职位发布）
     */
    @TableField("operation_module")
    private String operationModule;

    /**
     * 操作类型（如：新增、修改、删除）
     */
    @TableField("operation_type")
    private String operationType;

    /**
     * 操作内容（如：修改用户状态为禁用）
     */
    @TableField("operation_content")
    private String operationContent;

    /**
     * 请求URI
     */
    @TableField("request_uri")
    private String requestUri;

    /**
     * 请求方法（GET/POST/PUT/DELETE等）
     */
    @TableField("request_method")
    private String requestMethod;

    /**
     * 请求参数
     */
    @TableField("request_params")
    private String requestParams;

    /**
     * 操作时间
     */
    @TableField("operation_time")
    private LocalDateTime operationTime;

    /**
     * 操作IP地址（如：192.168.1.100）
     */
    @TableField("ip_address")
    private String ipAddress;

    /**
     * 用户代理
     */
    @TableField("user_agent")
    private String userAgent;

    /**
     * 操作结果：0-失败 1-成功
     */
    @TableField("operation_result")
    private Integer operationResult;

    /**
     * 耗时（毫秒）
     */
    @TableField("cost_time")
    private Integer costTime;

    /**
     * 错误信息（失败时填写，如：密码格式错误）
     */
    @TableField("error_msg")
    private String errorMsg;

    /**
     * 删除标记：0-未删 1-已删
     */
    @TableLogic
    @TableField("delete_flag")
    private Integer deleteFlag;
}