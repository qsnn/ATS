package com.platform.ats.common;

/**
 * 统一错误码定义
 */
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

    // 面试 Interview 模块 5000 - 5099
    INTERVIEW_NOT_FOUND(5000, "面试记录不存在"),
    INTERVIEW_STATUS_INVALID(5001, "面试状态不合法"),
    INTERVIEW_STATUS_TRANSITION_INVALID(5002, "面试状态流转不合法"),
    INTERVIEW_TIME_CONFLICT(5003, "面试时间冲突"),
    INTERVIEW_TIME_INVALID(5004, "面试时间不合法"),
    INTERVIEW_LOCATION_INVALID(5005, "面试地点不合法"),
    INTERVIEW_OWNER_MISMATCH(5006, "面试安排不属于当前用户"),
    INTERVIEW_APPLICATION_NOT_FOUND(5007, "面试关联的投递记录不存在"),

    // 人才库 / 简历 模块 6000 - 6099
    TALENT_NOT_FOUND(6000, "人才记录不存在"),
    TALENT_ALREADY_EXISTS(6001, "人才已存在于当前人才库"),
    TALENT_OWNER_MISMATCH(6002, "人才记录不属于当前公司"),
    TALENT_TAG_INVALID(6003, "人才标签不合法"),
    RESUME_NOT_FOUND(6004, "简历不存在"),
    RESUME_ALREADY_EXISTS(6005, "简历已存在"),
    RESUME_STATUS_INVALID(6006, "简历状态不合法"),
    RESUME_FORMAT_INVALID(6007, "简历格式不合法"),
    RESUME_PARSE_FAILED(6008, "简历解析失败"),
    RESUME_OWNER_MISMATCH(6009, "简历不属于当前用户"),

    // 公司 / 雇主 模块 7000 - 7099
    COMPANY_NOT_FOUND(7000, "公司信息不存在"),
    COMPANY_ALREADY_EXISTS(7001, "公司信息已存在"),
    COMPANY_STATUS_INVALID(7002, "公司状态不合法"),
    COMPANY_VERIFICATION_FAILED(7003, "公司认证未通过"),
    COMPANY_PERMISSION_DENIED(7004, "公司无权限执行该操作"),

    // 通用业务规则 9000 - 9099
    OPERATION_NOT_ALLOWED(9000, "当前状态不允许执行此操作"),
    DUPLICATE_OPERATION(9001, "请勿重复操作"),
    RATE_LIMIT_EXCEEDED(9002, "操作过于频繁，请稍后再试"),
    UPLOAD_FILE_INVALID(9003, "上传文件不合法"),
    UPLOAD_FILE_TOO_LARGE(9004, "上传文件过大"),
    EXPORT_LIMIT_EXCEEDED(9005, "导出数据量超出限制");

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
