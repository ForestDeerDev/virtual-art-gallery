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
            // 获取路径中的 id 参数，例如：/users/1/role 中的 1
            @PathVariable Long id,
            // 获取请求体中的 JSON 数据，例如："role": "admin"
            @RequestBody Map<String, String> request) {
        
        // 从请求体中取出 role 字段的值，request.get("role") -> "admin"
        String roleStr = request.get("role");
         // 转成大写后转换为 UserRole 枚举类型，"admin" -> "ADMIN"，UserRole.ADMIN
        UserRole role = UserRole.valueOf(roleStr.toUpperCase());
        // 调用业务层方法更新用户角色
        UserDTO user = userService.updateUserRole(id, role);
        // 返回 HTTP 200 响应，并把更新后的用户数据返回给前端
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

