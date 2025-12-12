package com.platform.ats.service;

import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;

/**
 * 示例：演示如何规范地使用BizException和ErrorCode
 * 
 * 这个类仅用于演示目的，展示了在不同场景下如何正确抛出业务异常
 */
public class ExampleExceptionUsage {
    
    /**
     * 示例1：用户相关异常处理
     */
    public void handleUserExceptions() {
        // 用户名已存在
        throw new BizException(ErrorCode.USERNAME_EXISTS);
        
        // 用户不存在
        // throw new BizException(ErrorCode.USER_NOT_FOUND);
        
        // 密码错误
        // throw new BizException(ErrorCode.PASSWORD_ERROR, "您输入的密码不正确");
    }
    
    /**
     * 示例2：职位相关异常处理
     */
    public void handleJobExceptions() {
        // 职位不存在
        throw new BizException(ErrorCode.JOB_NOT_FOUND);
        
        // 职位已发布
        // throw new BizException(ErrorCode.JOB_ALREADY_PUBLISHED);
        
        // 薪资范围不合法
        // throw new BizException(ErrorCode.JOB_SALARY_RANGE_INVALID, "最低薪资不能高于最高薪资");
    }
    
    /**
     * 示例3：申请相关异常处理
     */
    public void handleApplicationExceptions() {
        // 已申请过该职位
        throw new BizException(ErrorCode.APPLICATION_ALREADY_EXISTS);
        
        // 申请记录不存在
        // throw new BizException(ErrorCode.APPLICATION_NOT_FOUND);
    }
    
    /**
     * 示例4：收藏相关异常处理
     */
    public void handleFavoriteExceptions() {
        // 已收藏该职位
        throw new BizException(ErrorCode.FAVORITE_ALREADY_EXISTS);
        
        // 收藏记录不存在
        // throw new BizException(ErrorCode.FAVORITE_NOT_FOUND);
    }
}