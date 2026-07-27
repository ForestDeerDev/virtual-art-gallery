package com.artgallery.repository;

import com.artgallery.entity.User;
import com.artgallery.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * 用户数据访问接口
 * 继承JpaRepository提供基本的CRUD操作，并定义了用户相关的查询方法
 * 支持按用户名、邮箱、角色等多维度查询和统计功能
 * 
 * @author Art Gallery Team
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 根据用户名查找用户
     * 用于用户登录验证和用户信息查询
     * 
     * @param username 用户名
     * @return 用户对象的Optional包装，如果不存在则返回Optional.empty()
     */
    Optional<User> findByUsername(String username);

    /**
     * 根据邮箱查找用户
     * 用于用户注册验证、密码重置和第三方登录关联
     * 
     * @param email 邮箱地址
     * @return 用户对象的Optional包装，如果不存在则返回Optional.empty()
     */
    Optional<User> findByEmail(String email);

    /**
     * 检查用户名是否已存在
     * 用于用户注册时的重复性验证
     * 
     * @param username 要检查的用户名
     * @return true如果用户名已存在，false如果不存在
     */
    boolean existsByUsername(String username);

    /**
     * 检查邮箱是否已存在
     * 用于用户注册时的重复性验证
     * 
     * @param email 要检查的邮箱地址
     * @return true如果邮箱已存在，false如果不存在
     */
    boolean existsByEmail(String email);

    /**
     * 根据用户角色查找用户列表
     * 用于获取指定角色的所有用户，如管理员列表
     * 
     * @param role 用户角色（USER、ADMIN等）
     * @return 指定角色的用户列表
     */
    List<User> findByRole(UserRole role);

    /**
     * 根据兴趣标签查找用户
     * 查找标签中包含指定标签的用户，支持模糊匹配
     * 用于用户推荐和兴趣匹配
     * 
     * @param tag 标签名称
     * @return 包含指定标签的用户列表
     */
    @Query("SELECT u FROM User u WHERE u.tags LIKE %:tag%")
    List<User> findByTag(@Param("tag") String tag);

    /**
     * 查找指定状态的用户列表
     * 用于获取启用或禁用的用户，支持用户管理功能
     * 
     * @param enabled 是否启用（true=启用，false=禁用）
     * @return 指定状态的用户列表
     */
    List<User> findByEnabled(Boolean enabled);

    /**
     * 统计指定状态的用户总数
     * 用于后台数据统计和用户管理
     * 
     * @param enabled 是否启用
     * @return 符合条件的用户总数
     */
    long countByEnabled(Boolean enabled);

    /**
     * 按用户角色统计用户数量
     * 用于生成角色分布统计图表和管理面板数据展示
     * 
     * @return 角色统计结果，每个元素包含[角色名称, 用户数量]
     */
    @Query("SELECT u.role, COUNT(u) FROM User u GROUP BY u.role")
    List<Object[]> countByRole();

    /**
     * 根据第三方登录信息查找用户
     * 用于OAuth2登录，如GitHub、微信等第三方登录
     * 
     * @param provider 第三方登录提供商（如"github"、"wechat"等）
     * @param providerId 第三方登录提供商的用户ID
     * @return 对应的用户对象的Optional包装
     */
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
}

