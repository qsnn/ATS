package com.platform.ats.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 数据权限注解
 * 用于标识需要进行数据权限校验的方法
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DataPermission {
    
    /**
     * 数据权限类型
     * SELF: 只能操作自己的数据
     * COMPANY: 只能操作本公司数据
     * ALL: 可以操作所有数据（管理员）
     */
    Type value() default Type.SELF;
    
    enum Type {
        SELF,      // 只能访问自己的数据
        COMPANY,   // 只能访问同公司的数据
        ALL        // 可以访问所有数据
    }
}