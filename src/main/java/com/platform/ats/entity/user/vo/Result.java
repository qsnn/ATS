package com.platform.ats.entity.user.vo;

import lombok.Data;

/**
 * 统一返回结果封装类
 *
 * @author Administrator
 * @since 2025-12-13
 * @param <T> 数据类型参数
 */
@Data
public class Result<T> {
    /**
     * 状态码
     */
    private Integer code;
    
    /**
     * 消息
     */
    private String message;
    
    /**
     * 数据
     */
    private T data;
    
    /**
     * 时间戳
     */
    private Long timestamp;

    /**
     * 成功返回结果
     * 
     * @param data 数据
     * @param <T> 数据类型
     * @return Result对象
     */
    public static <T> Result<T> success(T data) {
        return success(data, "操作成功");
    }

    /**
     * 成功返回结果
     * 
     * @param data 数据
     * @param message 消息
     * @param <T> 数据类型
     * @return Result对象
     */
    public static <T> Result<T> success(T data, String message) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage(message);
        result.setData(data);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }

    /**
     * 错误返回结果
     * 
     * @param message 错误消息
     * @param <T> 数据类型
     * @return Result对象
     */
    public static <T> Result<T> error(String message) {
        return error(500, message);
    }

    /**
     * 错误返回结果
     * 
     * @param code 错误码
     * @param message 错误消息
     * @param <T> 数据类型
     * @return Result对象
     */
    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }

    /**
     * 失败结果的简写，供全局异常处理等场景使用
     * 
     * @param code 错误码
     * @param message 错误消息
     * @param <T> 数据类型
     * @return Result对象
     */
    public static <T> Result<T> failed(Integer code, String message) {
        return error(code, message);
    }
}