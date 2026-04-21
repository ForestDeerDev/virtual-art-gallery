package com.artgallery.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * RestTemplate配置类
 * 用于配置REST客户端，用于调用外部API（如GitHub OAuth API）
 * 
 * @author Art Gallery Team
 */
@Configuration
public class RestTemplateConfig {

    /**
     * 创建并配置RestTemplate bean
     * 
     * @return RestTemplate实例
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}