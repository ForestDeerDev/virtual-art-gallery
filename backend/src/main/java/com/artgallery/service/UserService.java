package com.artgallery.service;

import com.artgallery.dto.AuthResponse;
import com.artgallery.dto.LoginRequest;
import com.artgallery.dto.RegisterRequest;
import com.artgallery.dto.UserDTO;
import com.artgallery.entity.UserRole;
import com.artgallery.oauth.OAuthUserInfo;

import java.util.List;

/**
 * 用户服务接口
 * 定义用户相关的所有业务操作
 * 
 * @author Art Gallery Team
 */
public interface UserService {

    /**
     * 用户注册
     * 
     * @param request 注册请求
     * @return 认证响应（包含token和用户信息）
     */
    AuthResponse register(RegisterRequest request);

    /**
     * 用户登录
     * 
     * @param request 登录请求
     * @return 认证响应（包含token和用户信息）
     */
    AuthResponse login(LoginRequest request);

    /**
     * 第三方OAuth2登录（如GitHub）
     * 
     * @param userInfo OAuth用户信息
     * @return 认证响应（包含token和用户信息）
     */
    AuthResponse oauthLogin(OAuthUserInfo userInfo);

    /**
     * 获取用户信息
     * 
     * @param userId 用户ID
     * @return 用户DTO
     */
    UserDTO getUserInfo(Long userId);

    /**
     * 更新用户信息
     * 
     * @param userId 用户ID
     * @param userDTO 用户DTO
     * @return 更新后的用户DTO
     */
    UserDTO updateUserInfo(Long userId, UserDTO userDTO);

    /**
     * 获取所有用户列表（管理员功能）
     * 
     * @return 用户列表
     */
    List<UserDTO> getAllUsers();

    /**
     * 更新用户角色（管理员功能）
     * 
     * @param userId 用户ID
     * @param role 新角色
     * @return 更新后的用户DTO
     */
    UserDTO updateUserRole(Long userId, UserRole role);

    /**
     * 删除用户（管理员功能）
     * 
     * @param userId 用户ID
     */
    void deleteUser(Long userId);
}
