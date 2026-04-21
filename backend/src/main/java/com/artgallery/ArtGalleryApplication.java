package com.artgallery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * 虚拟艺术画廊管理系统 - 主应用类
 * 这是Spring Boot应用程序的入口点，负责启动整个系统
 * 
 * 系统功能：
 * - 艺术作品管理：创建、编辑、展示艺术作品
 * - 用户管理：用户注册、登录、权限控制
 * - 互动功能：评论、点赞、收藏
 * - 搜索推荐：基于标签和分类的智能推荐
 * - 文件上传：支持图片和视频文件上传
 * 
 * 技术栈：
 * - Spring Boot 3.x
 * - Spring Security 6.x (JWT认证)
 * - Spring Data JPA
 * - MySQL数据库
 * - Lombok
 * 
 * @author Art Gallery Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@SpringBootApplication
@EnableJpaAuditing  // 启用JPA审计功能，自动填充创建时间和更新时间
public class ArtGalleryApplication {

    /**
     * 应用程序主入口方法
     * 启动Spring Boot应用，初始化所有组件和配置
     * 
     * @param args 命令行参数
     */
    public static void main(String[] args) {
        SpringApplication.run(ArtGalleryApplication.class, args);
    }
}

