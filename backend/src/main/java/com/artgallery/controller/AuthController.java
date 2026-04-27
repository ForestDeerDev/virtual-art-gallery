package com.artgallery.controller;

import com.artgallery.dto.AuthResponse;
import com.artgallery.dto.LoginRequest;
import com.artgallery.dto.OAuthRequest;
import com.artgallery.dto.RegisterRequest;
import com.artgallery.service.OAuthService;
import com.artgallery.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 * 处理用户登录、注册等认证相关请求
 * 
 * @author Art Gallery Team
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final OAuthService oauthService;

    public AuthController(UserService userService, OAuthService oauthService) {
        this.userService = userService;
        this.oauthService = oauthService;
    }

    /**
     * 用户注册
     * 
     * @param request 注册请求
     * @return 认证响应（包含token和用户信息）
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 用户登录
     * 
     * @param request 登录请求
     * @return 认证响应（包含token和用户信息）
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 第三方登录（GitHub等）
     * 
     * @param provider 第三方提供商（github等）
     * @param request 包含授权码的请求
     * @return 认证响应
     */
    @PostMapping("/oauth/{provider}")
    public ResponseEntity<AuthResponse> oauthLogin(
            @PathVariable String provider,
            @RequestBody OAuthRequest request) {
        AuthResponse response = oauthService.oauthLogin(provider, request.getCode());
        return ResponseEntity.ok(response);
    }

}

