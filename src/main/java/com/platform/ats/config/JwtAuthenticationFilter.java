package com.platform.ats.config;

import com.platform.ats.entity.user.SysUser;
import com.platform.ats.service.UserService;
import com.platform.ats.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        try {
            String jwt = parseJwt(request);
            
            if (jwt != null && !jwt.isEmpty()) {
                try {
                    // 从JWT中提取用户ID和用户名
                    Long userId = jwtUtil.getUserIdFromToken(jwt);
                    String username = jwtUtil.getUsernameFromToken(jwt);
                    
                    // 验证令牌有效性
                    if (jwtUtil.validateToken(jwt, userId, username)) {
                        SysUser sysUser = userService.getUserById(userId);
                        
                        if (sysUser != null) {
                            UsernamePasswordAuthenticationToken authentication = 
                                new UsernamePasswordAuthenticationToken(
                                    sysUser.getUsername(), 
                                    null, 
                                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                                );
                                
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    } else {
                        logger.warn("JWT令牌验证失败: userId={}, username={}");
                    }
                } catch (Exception e) {
                    logger.error("JWT验证失败: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            logger.error("JWT过滤器处理异常: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}