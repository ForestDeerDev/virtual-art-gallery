package com.artgallery.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC配置类
 * 用于配置Spring MVC的相关设置，主要是静态资源处理
 * 
 * @author Art Gallery Team
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * 从配置文件中注入文件上传路径
     * 用于存储用户上传的艺术作品图片
     */
    @Value("${file.upload.path}")
    private String uploadPath;

    /**
     * 配置静态资源处理器
     * 将上传的文件映射为可通过HTTP访问的静态资源
     * 
     * @param registry 资源处理器注册表
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // 将 /uploads/** 路径映射到本地文件系统中的上传目录
        // 这样前端就可以通过 http://domain/uploads/filename.jpg 访问上传的文件
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath);
    }
}
