package com.platform.ats.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // JWT过期时间（毫秒）- 设置为24小时
    public static final long JWT_TOKEN_VALIDITY = 24 * 60 * 60 * 1000;

    // 固定的Base64编码密钥字符串，确保至少256位（32字节）
    // "consulting-system-secret-key-for-jwt-tokens-generation" 的 Base64 编码
    private static final String FIXED_SECRET_STRING = "Y29uc3VsdGluZy1zeXN0ZW0tc2VjcmV0LWtleS1mb3Itand0LXRva2Vucy1nZW5lcmF0aW9u"; 
    
    // 生成固定的签名密钥
    private final SecretKey secretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(FIXED_SECRET_STRING));

    // 从令牌中获取用户名
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // 从令牌中获取用户ID
    public Long getUserIdFromToken(String token) {
        return Long.valueOf(getAllClaimsFromToken(token).getId());
    }

    // 从令牌中获取过期时间
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    // 解析JWT令牌获取Claims
    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
    }

    // 检查令牌是否过期
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    // 生成JWT令牌
    public String generateToken(Long userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, userId, username);
    }

    // 创建JWT令牌
    private String doGenerateToken(Map<String, Object> claims, Long userId, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setId(String.valueOf(userId))
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(secretKey)
                .compact();
    }

    // 验证JWT令牌
    public Boolean validateToken(String token, Long userId, String username) {
        try {
            final String tokenUsername = getUsernameFromToken(token);
            final Long tokenUserId = getUserIdFromToken(token);
            return (username.equals(tokenUsername) && userId.equals(tokenUserId) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }
}