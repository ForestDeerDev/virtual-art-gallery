package com.artgallery.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT工具类
 * 用于生成和解析JWT令牌
 * 
 * @author Art Gallery Team
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * 生成JWT令牌
     * 
     * @param username 用户名
     * @param userId 用户ID
     * @param role 用户角色
     * @return JWT令牌
     */
    public String generateToken(String username, Long userId, String role) {
        // 创建声明
        Map<String, Object> claims = new HashMap<>();
        // 设置自定义声明
        claims.put("userId", userId);
        claims.put("role", role);
        
        return Jwts.builder()
                .setClaims(claims) // 设置自定义声明
                .setSubject(username) // 设置主题（用户名）
                .setIssuedAt(new Date()) // 设置签发时间
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // 设置过期时间
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // 使用密钥签名
                .compact(); // 压缩成JWT字符串
    }

    /**
     * 从令牌中获取用户名
     * 
     * @param token JWT令牌
     * @return 用户名
     */
    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    /**
     * 从令牌中获取用户ID
     * 
     * @param token JWT令牌
     * @return 用户ID
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("userId", Long.class);
    }

    /**
     * 从令牌中获取用户角色
     * 
     * @param token JWT令牌
     * @return 用户角色
     */
    public String getRoleFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("role", String.class);
    }

    /**
     * 验证令牌是否有效
     * 
     * @param token JWT令牌
     * @return 是否有效
     */
    public Boolean validateToken(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            // 返回true表示过期了，所以要用!取反
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 从令牌中获取Claims
     * 
     * @param token JWT令牌
     * @return Claims对象
     */
    // 使用JJWT库解析JWT
    // 验证JWT是否合法 + 解析出里面的数据（Claims）
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // 设置签名密钥 👉 用于验证 token 是否被篡改
                .build() // 构建解析器
                .parseClaimsJws(token) // 解析JWT 👉 将JWT字符串解析为Claims对象
                .getBody(); // 获取Claims 👉 从解析后的JWT中获取Claims对象
    }

    /**
     * 获取签名密钥
     * 
     * @return 签名密钥
     */
    private SecretKey getSigningKey() {
        // 使用UTF-8编码将密钥转换为字节数组
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        // 使用HMAC-SHA256算法生成密钥
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

