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
        UserPrincipal that = (UserPrincipal) o;
        return Objects.equals(userId, that.userId) && 
               Objects.equals(username, that.username) && 
               Objects.equals(role, that.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, userId, role);
    }

    @Override
    public String toString() {
        return "UserPrincipal{" +
                "username='" + username + '\'' +
                ", userId=" + userId +
                ", role='" + role + '\'' +
                '}';
    }
}
