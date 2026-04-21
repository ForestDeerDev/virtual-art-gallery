package com.artgallery.entity;

/**
 * 用户角色枚举
 * 定义系统中的用户角色类型，用于权限控制
 * 
 * @author Art Gallery Team
 */
public enum UserRole {
    /**
     * 普通用户角色
     * 权限：创建、编辑、删除自己的作品；评论、点赞作品
     * 不能访问管理员功能
     */
    USER,
    
    /**
     * 管理员角色
     * 权限：拥有所有用户权限；管理所有用户和作品；系统配置
     * 可以访问系统管理面板和所有管理功能
     */
    ADMIN
}

