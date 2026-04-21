package com.artgallery.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS跨域配置
 * 允许前端应用访问后端API
 * 
 * @author Art Gallery Team
 */
@Configuration
public class CorsConfig {

    /**
     * 配置CORS过滤器
     * 
     * @return CorsFilter
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 允许所有来源（生产环境应指定具体的前端地址）
        // 注意：使用 allowCredentials(true) 时不能使用 "*"，需要使用具体的源或 OriginPattern
        config.addAllowedOriginPattern("*");
        
        // 允许所有请求头
        config.addAllowedHeader("*");
        
        // 允许所有HTTP方法
        config.addAllowedMethod("*");
        
        // 由于使用了 OriginPattern，allowCredentials 可以设置为 false（JWT不需要Cookie）
        // 如果需要携带凭证，应该指定具体的源地址而不是使用 "*"
        config.setAllowCredentials(false);
        
        // 预检请求的缓存时间（秒）
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}

