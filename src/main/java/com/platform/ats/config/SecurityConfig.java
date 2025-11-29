package com.platform.ats.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用 CSRF 防护，便于测试
                .csrf(AbstractHttpConfigurer::disable)
//                // 配置请求授权规则
//                .authorizeHttpRequests(auth -> auth
//                        // 允许对注册接口、Swagger UI 和 API 文档的匿名访问
//                        .requestMatchers("/api/user/register", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
//                        // 其他所有请求都需要身份验证
//                        .anyRequest().authenticated()
//                )
//                // 启用 HTTP Basic 认证
//                .httpBasic(withDefaults());
                // 配置请求授权规则
                .authorizeHttpRequests(auth -> auth
                        // 允许所有请求，无需身份验证
                        .anyRequest().permitAll()
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 定义密码编码器，用于密码加密和验证
        return new BCryptPasswordEncoder();
    }
}
