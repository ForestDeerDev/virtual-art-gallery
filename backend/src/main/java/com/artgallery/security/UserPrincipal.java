package com.artgallery.security;

import java.util.Objects;

/**
 * 用户Principal
 * 用于存储JWT中提取的用户信息（username, userId, role）
 * 
 * @author Art Gallery Team
 */
public class UserPrincipal {
    
    private final String username;
    private final Long userId;
    private final String role;

    public UserPrincipal(String username, Long userId, String role) {
        this.username = username;
        this.userId = userId;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public Long getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        // 将 Object 类型的 o 强制转换为 UserPrincipal 类型
        UserPrincipal that = (UserPrincipal) o;
        return Objects.equals(userId, that.userId) && 
               Objects.equals(username, that.username) && 
               Objects.equals(role, that.role);
    }

    // 原本是基于对象内存地址生成哈希值，重写后改为基于 username、userId、role 三个字段的内容计算哈希值。
    @Override
    public int hashCode() {
        return Objects.hash(username, userId, role);
    }

    // 默认 `toString()` 只输出类名+hash值；重写后按自定义规则输出对象字段内容，便于直观查看对象状态。
    // com.xxx.UserPrincipal@3e25a5 -> UserPrincipal{username='admin', userId=1, role='ADMIN'}
    @Override
    public String toString() {
        return "UserPrincipal{" +
                "username='" + username + '\'' +
                ", userId=" + userId +
                ", role='" + role + '\'' +
                '}';
    }
}
