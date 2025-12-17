package com.platform.ats.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
// 启用AspectJ自动代理，支持数据权限切面
@EnableAspectJAutoProxy
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                // 禁用 CSRF 防护，便于 API 访问
                .csrf(AbstractHttpConfigurer::disable)
                // 设置会话策略为无状态
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 配置请求授权规则
                .authorizeHttpRequests(auth -> auth
                        // 允许对静态资源的访问
                        .requestMatchers("/", "/index.html", "/login.html", "/register.html", "reset-password.html", "/favicon.ico").permitAll()
                        .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                        // 允许访问所有仪表板页面（权限控制将在前端处理）
                        .requestMatchers("/*-dashboard.html").permitAll()
                        // 允许对注册接口、登录接口、Swagger UI 和 API 文档的匿名访问
                        .requestMatchers("/api/user/register", "/api/user/login", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // 允许对重置密码验证接口的匿名访问
                        .requestMatchers("/api/user/reset-password-validate").permitAll()
                        // 允许对所有/api/user开头的接口进行访问（但特定接口仍需认证）
                        .requestMatchers("/api/user/check/**").permitAll()
                        // 允许HR相关接口访问（但特定接口仍需认证）
                        .requestMatchers("/api/user/hr/**").authenticated()
                        // 允许职位信息接口访问
                        .requestMatchers("/api/job/info/**").authenticated()
                        // 允许日志接口访问（仅管理员）
                        .requestMatchers("/api/logs/**").authenticated()
                        // 其他所有请求都需要身份验证
                        .anyRequest().authenticated()
                )
                // 添加JWT认证过滤器
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 定义密码编码器，用于密码加密和验证
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}