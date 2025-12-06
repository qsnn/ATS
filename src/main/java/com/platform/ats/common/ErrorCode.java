package com.platform.ats.common;

/**
 * 统一错误码定义
 */
public enum ErrorCode {

    // 通用错误
    SUCCESS(200, "成功"),
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未登录或登录已过期"),
    FORBIDDEN(403, "没有访问权限"),
    NOT_FOUND(404, "资源不存在"),
    INTERNAL_ERROR(500, "系统内部错误"),

    // 用户相关错误码 1000 - 1099
    USER_NOT_FOUND(1000, "用户不存在"),
    USERNAME_EXISTS(1001, "用户名已存在"),
    PHONE_EXISTS(1002, "手机号已存在"),
    EMAIL_EXISTS(1003, "邮箱已存在"),
    ACCOUNT_DISABLED(1004, "账号已被禁用"),
    PASSWORD_ERROR(1005, "密码错误"),

    ;

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}

