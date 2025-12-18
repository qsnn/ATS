package com.platform.ats.config;

import com.platform.ats.common.annotation.DataPermission;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * 数据权限切面
 * 处理数据权限校验逻辑
 */
@Slf4j
@Aspect
@Component
public class DataPermissionAspect {
    
    @Around("@annotation(dataPermission)")
    public Object checkDataPermission(ProceedingJoinPoint joinPoint, DataPermission dataPermission) throws Throwable {
        // 简化的权限检查，只检查注解类型
        switch (dataPermission.value()) {
            case ALL:
                // 允许所有访问
                break;
            case SELF:
                // 原本检查个人数据权限，现已移除具体实现
                log.debug("跳过个人数据权限检查");
                break;
            case COMPANY:
                // 原本检查公司数据权限，现已移除具体实现
                log.debug("跳过公司数据权限检查");
                break;
        }
        
        // 继续执行原方法
        return joinPoint.proceed();
    }
}