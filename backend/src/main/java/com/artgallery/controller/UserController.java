package com.artgallery.controller;

import com.artgallery.dto.UserDTO;
import com.artgallery.security.SecurityUtils;
import com.artgallery.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 * 处理用户相关的RESTful API请求
 * 
 * @author Art Gallery Team
 */
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 获取当前用户信息
     * 
     * @param request HTTP请求
     * @return 用户信息
     */
    @GetMapping("/info")
    public ResponseEntity<UserDTO> getUserInfo() {
        Long userId = SecurityUtils.getCurrentUserId();
        UserDTO userDTO = userService.getUserInfo(userId);
        return ResponseEntity.ok(userDTO);
    }

    /**
     * 获取用户信息（通过用户ID）
     * 
     * @param id 用户ID
     * @return 用户信息
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable("id") Long id) {
        UserDTO userDTO = userService.getUserInfo(id);
        return ResponseEntity.ok(userDTO);
    }

    /**
     * 更新用户资料
     * 
     * @param userDTO 用户DTO
     * @param request HTTP请求
     * @return 更新后的用户信息
     */
    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO userDTO) {
        Long userId = SecurityUtils.getCurrentUserId();
        UserDTO updatedUser = userService.updateUserInfo(userId, userDTO);
        return ResponseEntity.ok(updatedUser);
    }
}