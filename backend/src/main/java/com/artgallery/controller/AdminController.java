package com.artgallery.controller;

import com.artgallery.dto.StatsDTO;
import com.artgallery.dto.UserDTO;
import com.artgallery.entity.UserRole;
import com.artgallery.service.AdminService;
import com.artgallery.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 管理员控制器
 * 处理管理员相关的RESTful API请求
 * 
 * @author Art Gallery Team
 */
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final AdminService adminService;

    public AdminController(UserService userService, AdminService adminService) {
        this.userService = userService;
        this.adminService = adminService;
    }

    /**
     * 获取所有用户列表
     * 
     * GET /api/admin/users
     * 
     * @return 用户列表
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * 更新用户角色
     * 
     * PUT /api/admin/users/{id}/role
     * 
     * @param id 用户ID
     * @param request 包含role的请求
     * @return 更新后的用户信息
     */
    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        String roleStr = request.get("role");
        UserRole role = UserRole.valueOf(roleStr.toUpperCase());
        UserDTO user = userService.updateUserRole(id, role);
        return ResponseEntity.ok(user);
    }

    /**
     * 删除用户
     * 
     * DELETE /api/admin/users/{id}
     * 
     * @param id 用户ID
     * @return 成功响应
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 获取系统统计信息
     * 
     * GET /api/admin/stats
     * 
     * @return 统计信息
     */
    @GetMapping("/stats")
    public ResponseEntity<StatsDTO> getStats() {
        StatsDTO stats = adminService.getStats();
        return ResponseEntity.ok(stats);
    }
}

