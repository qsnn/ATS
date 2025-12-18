package com.platform.ats.common;

import lombok.Getter;

/**
 * 统一错误码定义
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Getter
public enum ErrorCode {

    // 通用错误 0-999
    SUCCESS(200, "成功"),
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未登录或登录已过期"),
    FORBIDDEN(403, "没有访问权限"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不被允许"),
    UNSUPPORTED_MEDIA_TYPE(415, "不支持的请求类型"),
    INTERNAL_ERROR(500, "系统内部错误"),
    DB_ERROR(501, "数据库操作异常"),
    REMOTE_SERVICE_ERROR(502, "远程服务调用失败"),

    // 通用参数 & 分页 8000-8099
    PARAM_MISSING(8000, "缺少必填参数"),
    PARAM_INVALID(8001, "参数不合法"),
    PAGINATION_PAGE_INVALID(8002, "页码不合法"),
    PAGINATION_SIZE_INVALID(8003, "每页大小不合法"),
    SORT_FIELD_INVALID(8004, "排序字段不支持"),
    DATE_RANGE_INVALID(8005, "时间范围不合法"),

    // 用户相关错误码 1000 - 1099
    USER_NOT_FOUND(1000, "用户不存在"),
    USERNAME_EXISTS(1001, "用户名已存在"),
    PHONE_EXISTS(1002, "手机号已存在"),
    EMAIL_EXISTS(1003, "邮箱已存在"),
    ACCOUNT_DISABLED(1004, "账号已被禁用"),
    PASSWORD_ERROR(1005, "密码错误"),
    ACCOUNT_LOCKED(1006, "账号已被锁定"),
    PASSWORD_FORMAT_INVALID(1007, "密码格式不符合要求"),
    USER_ROLE_INVALID(1008, "用户角色不合法"),
    AUTH_TOKEN_INVALID(1010, "登录凭证无效"),
    AUTH_TOKEN_EXPIRED(1011, "登录凭证已过期"),
    AUTH_CREDENTIALS_MISSING(1012, "缺少认证信息"),
    LOGIN_FAILED(1013, "登录失败"),
    REGISTER_CONFLICT(1014, "注册信息冲突"),

    // 职位 Job 模块 2000 - 2099
    JOB_NOT_FOUND(2000, "职位不存在"),
    JOB_STATUS_INVALID(2001, "职位状态不合法"),
    JOB_PUBLISH_FORBIDDEN(2002, "没有权限发布或编辑该职位"),
    JOB_ALREADY_PUBLISHED(2003, "职位已发布"),
    JOB_NOT_PUBLISHED(2004, "职位未发布"),
    JOB_TITLE_REQUIRED(2005, "职位标题必填"),
    JOB_CATEGORY_INVALID(2006, "职位类别不合法"),
    JOB_LOCATION_INVALID(2007, "职位地点信息不合法"),
    JOB_SALARY_RANGE_INVALID(2008, "薪资范围不合法"),
    JOB_EXPERIENCE_INVALID(2009, "工作经验要求不合法"),
    JOB_EDUCATION_INVALID(2010, "学历要求不合法"),

    // 职位收藏 Favorite 模块 3000 - 3099
    FAVORITE_ALREADY_EXISTS(3000, "已收藏该职位"),
    FAVORITE_NOT_FOUND(3001, "收藏记录不存在"),
    FAVORITE_LIMIT_EXCEEDED(3002, "收藏数量超出上限"),
    FAVORITE_JOB_NOT_AVAILABLE(3003, "收藏的职位已失效"),
    FAVORITE_OWNER_MISMATCH(3004, "收藏记录不属于当前用户"),

    // 职位申请 Application 模块 4000 - 4099
    APPLICATION_NOT_FOUND(4000, "申请记录不存在"),
    APPLICATION_ALREADY_EXISTS(4001, "已申请该职位"),
    APPLICATION_STATUS_INVALID(4002, "申请状态不合法"),
    APPLICATION_STATUS_TRANSITION_INVALID(4003, "申请状态流转不合法"),
    APPLICATION_JOB_NOT_AVAILABLE(4004, "职位不可申请"),
    APPLICATION_RESUME_REQUIRED(4005, "申请时简历必填"),
    APPLICATION_RESUME_NOT_FOUND(4006, "申请使用的简历不存在"),
    APPLICATION_OWNER_MISMATCH(4007, "申请记录不属于当前用户"),

    // 人才库相关错误码
    TALENT_NOT_FOUND(40001, "人才库记录不存在"),
    TALENT_ALREADY_EXISTS(40002, "该简历已在人才库中"),
    
    // 公司信息相关错误码
    COMPANY_NOT_FOUND(50001, "公司信息不存在");

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
