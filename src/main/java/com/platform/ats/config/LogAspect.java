package com.platform.ats.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.ats.common.annotation.LogOperation;
import com.platform.ats.entity.log.SysOperationLog;
import com.platform.ats.entity.user.SysUser;
import com.platform.ats.service.LogService;
import com.platform.ats.service.UserService;
import com.platform.ats.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

/**
 * 操作日志切面处理类
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class LogAspect {
    
    private final LogService logService;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final ObjectMapper objectMapper; // 添加 ObjectMapper 用于 JSON 处理
    
    @Around("@annotation(logOperation)")
    public Object recordLog(ProceedingJoinPoint joinPoint, LogOperation logOperation) throws Throwable {
        // 记录开始时间
        long startTime = System.currentTimeMillis();
        
        // 创建日志对象
        SysOperationLog operationLog = new SysOperationLog();
        operationLog.setOperationTime(LocalDateTime.now());
        
        // 获取请求相关信息
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            operationLog.setRequestUri(request.getRequestURI());
            operationLog.setRequestMethod(request.getMethod());
            operationLog.setIpAddress(getClientIpAddress(request));
            operationLog.setUserAgent(request.getHeader("User-Agent"));
        }
        
        // 获取操作用户信息
        SysUser currentUser = getCurrentUser();
        if (currentUser != null) {
            operationLog.setUserId(currentUser.getUserId());
            operationLog.setUsername(currentUser.getUsername());
        }
        
        // 设置操作模块和类型
        operationLog.setOperationModule(logOperation.module());
        operationLog.setOperationType(logOperation.type());
        operationLog.setOperationContent(logOperation.content());
        
        // 记录请求参数（排除文件上传参数）
        try {
            Object[] args = Arrays.stream(joinPoint.getArgs())
                    .filter(arg -> !(arg instanceof MultipartFile))
                    .filter(arg -> !(arg instanceof MultipartFile[]))
                    .toArray();
            if (args.length > 0) {
                operationLog.setRequestParams(objectMapper.writeValueAsString(args));
            }
        } catch (Exception e) {
            operationLog.setRequestParams("参数序列化失败");
        }
        
        try {
            // 执行原方法
            Object result = joinPoint.proceed();
            
            // 记录成功操作
            operationLog.setOperationResult(1); // 成功
            
            return result;
        } catch (Exception e) {
            // 记录失败操作
            operationLog.setOperationResult(0); // 失败
            operationLog.setErrorMsg(e.getMessage());
            
            throw e;
        } finally {
            // 计算耗时
            long endTime = System.currentTimeMillis();
            operationLog.setCostTime((int) (endTime - startTime));
            
            // 异步保存日志（避免影响主业务流程）
            try {
                logService.save(operationLog);
            } catch (Exception e) {
                log.error("保存操作日志失败: ", e);
            }
        }
    }
    
    /**
     * 获取当前登录用户
     */
    private SysUser getCurrentUser() {
        try {
            // 在登录过程中，SecurityContext可能尚未设置，先尝试从请求中获取JWT
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String jwt = parseJwt(request);
                if (jwt != null) {
                    Long userId = jwtUtil.getUserIdFromToken(jwt);
                    return userService.getUserById(userId);
                }
                
                // 如果无法从JWT获取，则尝试从SecurityContext获取认证信息
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                if (principal instanceof String) {
                    String username = (String) principal;
                    // 通过用户名查找用户信息
                    return userService.getUserByUsername(username);
                }
            }
        } catch (Exception e) {
            log.debug("获取用户信息失败: {}", e.getMessage());
        }
        return null;
    }
    
    /**
     * 从请求中解析JWT
     */
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        
        return null;
    }
    
    /**
     * 获取客户端IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return Optional.ofNullable(request.getRemoteAddr()).orElse("");
    }
}