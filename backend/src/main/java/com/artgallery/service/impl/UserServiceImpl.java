package com.artgallery.service.impl;

import com.artgallery.dto.*;
import com.artgallery.entity.User;
import com.artgallery.entity.UserRole;
import com.artgallery.exception.BusinessException;
import com.artgallery.mapper.UserMapper;
import com.artgallery.oauth.OAuthUserInfo;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.UserService;
import com.artgallery.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户服务实现类
 * 
 * @author Art Gallery Team
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userMapper = userMapper;
    }

    /**
     * 用户注册
     * 
     * @param request 注册请求
     * @return 认证响应（包含token和用户信息）
     */
    public AuthResponse register(RegisterRequest request) {
        // 检查用户名是否已存在
        // 方法(另一个方法()) 👉 内层方法返回值 → 作为外层方法参数
        // getUsername() 是方法，但它执行完之后的“返回值”被当作参数使用
        if (userRepository.existsByUsername(request.getUsername())) {
            // request.getUsername() 👉 从请求对象里拿用户名（方法）
            // existsByUsername(...) 👉 去数据库查：这个用户名存在吗？
            throw new BusinessException("USERNAME_EXISTS", "用户名已存在");
        }

        // 检查邮箱是否已存在
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("EMAIL_EXISTS", "邮箱已被注册");
        }

        // 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));  // 密码加密
        user.setRole(UserRole.USER);
        user.setEnabled(true);
        
        // 设置兴趣标签
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            user.setTagsList(request.getTags());
        }

        // 保存用户
        user = userRepository.save(user);

        // 生成JWT令牌
        String token = jwtUtil.generateToken(
            user.getUsername(), 
            user.getId(), 
            user.getRole().name()
        );

        return new AuthResponse(token, userMapper.toDto(user));
    }

    /**
     * 用户登录
     * 
     * @param request 登录请求
     * @return 认证响应（包含token和用户信息）
     */
    public AuthResponse login(LoginRequest request) {
        // 查找用户
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户名或密码错误"));

        // 验证密码
        // encode(rawPassword) 和 encodedPassword 比较
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("INVALID_PASSWORD", "用户名或密码错误");
        }

        // 检查用户是否启用
        if (!user.getEnabled()) {
            throw new BusinessException("USER_DISABLED", "用户已被禁用");
        }

        // 生成JWT令牌
        String token = jwtUtil.generateToken(
            user.getUsername(), 
            user.getId(), 
            user.getRole().name()
        );

        return new AuthResponse(token, userMapper.toDto(user));
    }

    /**
     * 第三方OAuth2登录（如GitHub）
     * 
     * @param userInfo OAuth用户信息
     * @return 认证响应（包含token和用户信息）
     */
    public AuthResponse oauthLogin(OAuthUserInfo userInfo) {
        // 根据提供商和提供商ID查找用户
        User user = userRepository.findByProviderAndProviderId(
                userInfo.getProvider(), 
                userInfo.getProviderUserId())
            .orElseGet(() -> {
                // 检查邮箱是否已存在（用于关联已有账号）
                User existingUser = userRepository.findByEmail(userInfo.getEmail()).orElse(null);
                if (existingUser != null) {
                    // 如果邮箱已存在，关联第三方登录信息
                    existingUser.setProvider(userInfo.getProvider());
                    existingUser.setProviderId(userInfo.getProviderUserId());
                    if (userInfo.getAvatarUrl() != null) {
                        existingUser.setAvatar(userInfo.getAvatarUrl());
                    }
                    return userRepository.save(existingUser);
                }
                
                // 创建新用户
                User newUser = new User();
                newUser.setUsername(userInfo.getUsername());
                newUser.setEmail(userInfo.getEmail());
                newUser.setPassword("oauth2_user"); // OAuth2用户不需要密码
                newUser.setAvatar(userInfo.getAvatarUrl());
                newUser.setRole(UserRole.USER);
                newUser.setEnabled(true);
                newUser.setProvider(userInfo.getProvider());
                newUser.setProviderId(userInfo.getProviderUserId());
                return userRepository.save(newUser);
            });

        // 检查用户是否启用
        if (!user.getEnabled()) {
            throw new BusinessException("USER_DISABLED", "用户已被禁用");
        }

        // 生成JWT令牌
        String token = jwtUtil.generateToken(
            user.getUsername(), 
            user.getId(), 
            user.getRole().name()
        );

        return new AuthResponse(token, userMapper.toDto(user));
    }

    /**
     * 获取用户信息
     * 
     * @param userId 用户ID
     * @return 用户DTO
     */
    public UserDTO getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        return userMapper.toDto(user);
    }

    /**
     * 更新用户信息
     * 
     * @param userId 用户ID
     * @param userDTO 用户DTO
     * @return 更新后的用户DTO
     */
    public UserDTO updateUserInfo(Long userId, UserDTO userDTO) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        // 更新用户信息（不允许更新角色）
        if (userDTO.getUsername() != null) {
            // 检查新用户名是否已被其他用户使用
            if (!user.getUsername().equals(userDTO.getUsername()) && 
                userRepository.existsByUsername(userDTO.getUsername())) {
                throw new BusinessException("USERNAME_EXISTS", "用户名已存在");
            }
            user.setUsername(userDTO.getUsername());
        }

        if (userDTO.getEmail() != null) {
            // 检查新邮箱是否已被其他用户使用
            if (!user.getEmail().equals(userDTO.getEmail()) && 
                userRepository.existsByEmail(userDTO.getEmail())) {
                throw new BusinessException("EMAIL_EXISTS", "邮箱已被注册");
            }
            user.setEmail(userDTO.getEmail());
        }

        if (userDTO.getAvatar() != null) {
            user.setAvatar(userDTO.getAvatar());
        }

        if (userDTO.getTags() != null) {
            user.setTagsList(userDTO.getTags());
        }

        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    /**
     * 获取所有用户列表（管理员功能）
     * 
     * @return 用户列表
     */
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(userMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * 更新用户角色（管理员功能）
     * 
     * @param userId 用户ID
     * @param role 新角色
     * @return 更新后的用户DTO
     */
    public UserDTO updateUserRole(Long userId, UserRole role) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        
        user.setRole(role);
        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    /**
     * 删除用户（管理员功能）
     * 
     * @param userId 用户ID
     */
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        
        userRepository.delete(user);
    }
}

