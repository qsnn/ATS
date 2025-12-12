package com.platform.ats.config;

import com.platform.ats.common.annotation.DataPermission;
import com.platform.ats.entity.user.SysUser;
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

import java.util.Arrays;

/**
 * 数据权限切面
 * 处理数据权限校验逻辑
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class DataPermissionAspect {
    
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    @Around("@annotation(dataPermission)")
    public Object checkDataPermission(ProceedingJoinPoint joinPoint, DataPermission dataPermission) throws Throwable {
        // 获取当前用户信息
        SysUser currentUser = getCurrentUser();
        if (currentUser == null) {
            log.warn("无法获取当前用户信息");
            throw new RuntimeException("无法获取当前用户信息");
        }
        
        // 获取方法参数
        Object[] args = joinPoint.getArgs();
        
        switch (dataPermission.value()) {
            case SELF:
                checkSelfPermission(currentUser, args);
                break;
            case COMPANY:
                checkCompanyPermission(currentUser, args);
                break;
            case ALL:
                // 管理员可以访问所有数据，无需额外检查
                break;
        }
        
        // 继续执行原方法
        return joinPoint.proceed();
    }
    
    /**
     * 获取当前登录用户
     */
    private SysUser getCurrentUser() {
        try {
            // 从SecurityContext获取认证信息
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof String) {
                String username = (String) principal;
                
                // 通过用户名查找用户信息
                return userService.getUserByUsername(username);
            }
        } catch (Exception e) {
            log.debug("从SecurityContext获取用户信息失败: {}", e.getMessage());
            // 如果从SecurityContext获取失败，尝试从JWT获取
            try {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    HttpServletRequest request = attributes.getRequest();
                    String jwt = parseJwt(request);
                    if (jwt != null) {
                        Long userId = jwtUtil.getUserIdFromToken(jwt);
                        return userService.getUserById(userId);
                    }
                }
            } catch (Exception ex) {
                log.debug("从JWT获取用户信息失败: {}", ex.getMessage());
                // 忽略异常
            }
        }
        return null;
    }
    
    /**
     * 检查个人数据权限（只能操作自己的数据）
     */
    private void checkSelfPermission(SysUser currentUser, Object[] args) {
        // 检查参数中是否包含用户ID，并验证是否是当前用户ID
        boolean hasPermission = Arrays.stream(args).anyMatch(arg -> {
            if (arg instanceof Long && arg.equals(currentUser.getUserId())) {
                return true; // 权限验证通过
            }
            
            // 如果参数是一个对象，且包含userId字段，也进行检查
            if (arg != null) {
                try {
                    java.lang.reflect.Field userIdField = arg.getClass().getDeclaredField("userId");
                    userIdField.setAccessible(true);
                    Object userIdObj = userIdField.get(arg);
                    if (userIdObj instanceof Long && ((Long) userIdObj).equals(currentUser.getUserId())) {
                        return true; // 权限验证通过
                    }
                } catch (Exception e) {
                    // 忽略反射异常
                }
            }
            return false;
        });
        
        // 如果没有找到匹配的userId，抛出异常
        if (!hasPermission) {
            log.warn("用户 {} 尝试访问不属于自己的数据", currentUser.getUsername());
            throw new RuntimeException("没有权限访问该资源");
        }
    }
    
    /**
     * 检查公司数据权限（只能操作同公司的数据）
     */
    private void checkCompanyPermission(SysUser currentUser, Object[] args) {
        // 如果用户没有公司ID，无法进行公司级别权限校验
        if (currentUser.getCompanyId() == null) {
            log.warn("用户 {} 没有关联的公司信息", currentUser.getUsername());
            throw new RuntimeException("用户没有关联的公司信息");
        }
        
        // 检查参数中是否包含公司ID，并验证是否是当前用户所在公司
        boolean hasPermission = Arrays.stream(args).anyMatch(arg -> {
            if (arg instanceof Long && arg.equals(currentUser.getCompanyId())) {
                return true; // 权限验证通过
            }
            
            // 如果参数是一个对象，且包含companyId字段，也进行检查
            if (arg != null) {
                try {
                    java.lang.reflect.Field companyIdField = arg.getClass().getDeclaredField("companyId");
                    companyIdField.setAccessible(true);
                    Object companyIdObj = companyIdField.get(arg);
                    if (companyIdObj instanceof Long && ((Long) companyIdObj).equals(currentUser.getCompanyId())) {
                        return true; // 权限验证通过
                    }
                } catch (Exception e) {
                    // 忽略反射异常
                }
            }
            return false;
        });
        
        // 如果没有找到匹配的companyId，抛出异常
        if (!hasPermission) {
            log.warn("用户 {} 尝试访问不属于其公司的数据", currentUser.getUsername());
            throw new RuntimeException("没有权限访问该公司资源");
        }
    }
    
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (org.springframework.util.StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}