package com.artgallery.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * CORS跨域配置
 * 允许前端应用访问后端API
 *
 * @author Art Gallery Team
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // 开发环境前端地址
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("http://localhost:3000");

        // 允许请求头
        config.addAllowedHeader("*");

        // 允许请求方法
        config.addAllowedMethod("*");

        // JWT 使用 Authorization Header，不使用 Cookie
        config.setAllowCredentials(false);

        // 预检请求缓存时间
        config.setMaxAge(3600L);

        // 为所有路径注册 CORS 配置
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}

