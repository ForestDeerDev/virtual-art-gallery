package com.artgallery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 用户实体类
 * 定义系统用户的数据结构和业务属性
 * 支持本地注册登录和第三方OAuth登录
 * 
 * @author Art Gallery Team
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_email", columnList = "email")
})
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
// 给实体类添加审计功能，自动管理创建时间和更新时间
@EntityListeners(AuditingEntityListener.class)
public class User extends BaseTaggableEntity {

    /**
     * 用户ID，主键，自增
     * 用于唯一标识系统中的每个用户
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 用户名，唯一，不能为空
     * 用于用户登录和系统内显示
     */
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    /**
     * 邮箱地址，唯一，不能为空
     * 用于用户注册验证、密码重置和通知
     */
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /**
     * 用户密码（加密存储），不能为空
     * 使用BCrypt加密算法存储，确保安全性
     */
    @Column(nullable = false)
    private String password;

    /**
     * 用户头像URL
     * 可选字段，用于显示用户头像
     */
    @Column(length = 500)
    private String avatar;

    /**
     * 用户角色枚举
     * USER：普通用户，可以创建和管理自己的作品
     * ADMIN：管理员，拥有系统管理权限
     */
    
    // 将枚举类型转换为字符串存储到数据库中
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.USER;


    /**
     * 账户启用状态
     * true：启用，可以正常使用系统功能
     * false：禁用，无法登录和使用系统
     */
    @Column(nullable = false)
    private Boolean enabled = true;

    /**
     * 第三方登录提供商
     * 如：github、wechat等，用于OAuth登录
     */
    @Column(length = 20)
    private String provider;

    /**
     * 第三方登录提供商的用户ID
     * 用于关联第三方平台的用户身份
     */
    @Column(length = 50)
    private String providerId;

    /**
     * 账户创建时间
     * 由JPA审计功能自动填充，不可更新
     */
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createTime;

    /**
     * 账户最后更新时间
     * 由JPA审计功能自动填充，每次更新时自动更新
     */
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updateTime;

    /**
     * 用户创建的艺术作品集合
     * 一对多关系，级联操作，懒加载
     */
    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Artwork> artworks = new ArrayList<>();

}
