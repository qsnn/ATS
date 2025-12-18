package com.platform.ats.common;

import lombok.Getter;

/**
 * 业务异常，携带统一错误码
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Getter
public class BizException extends RuntimeException {

    /**
     * 错误码
     */
    private final int code;

    /**
     * 构造函数
     * 
     * @param errorCode 错误码枚举
     */
    public BizException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
    }

    /**
     * 构造函数
     * 
     * @param errorCode 错误码枚举
     * @param message 异常消息
     */
    public BizException(ErrorCode errorCode, String message) {
        super(message);
        this.code = errorCode.getCode();
    }

    /**
     * 构造函数
     * 
     * @param code 错误码
     * @param message 异常消息
     */
    public BizException(int code, String message) {
        super(message);
        this.code = code;
    }

    /**
     * 获取错误码
     * 
     * @return 错误码
     */
    public int getCode() {
        return code;
    }
}

