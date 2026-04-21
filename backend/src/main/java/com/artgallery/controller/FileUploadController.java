package com.artgallery.controller;

import com.artgallery.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * 文件上传控制器
 * 处理艺术作品图片和用户头像的上传请求
 * 
 * @author Art Gallery Team
 */
@RestController
@RequestMapping("/upload")
public class FileUploadController {

    /**
     * 文件存储服务
     * 负责处理文件的物理存储和URL生成
     */
    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * 上传艺术作品图片
     * 
     * POST /api/upload/artwork
     * 
     * @param file 上传的图片文件
     * @return 包含文件URL的响应
     */
    @PostMapping("/artwork")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> uploadArtworkImage(@RequestParam("file") MultipartFile file) {
        // 调用文件存储服务保存文件并获取访问URL
        String fileUrl = fileStorageService.storeArtworkFile(file);
        
        // 构建响应数据，包含文件的访问URL
        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        return ResponseEntity.ok(response);
    }

    /**
     * 上传用户头像
     * 
     * POST /api/upload/avatar
     * 
     * @param file 上传的头像文件
     * @return 包含文件URL的响应
     */
    @PostMapping("/avatar")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        // 调用文件存储服务保存头像文件并获取访问URL
        String fileUrl = fileStorageService.storeAvatarFile(file);
        
        // 构建响应数据，包含头像的访问URL
        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        return ResponseEntity.ok(response);
    }
}
