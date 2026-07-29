package com.artgallery.service.impl;

import com.artgallery.service.FileStorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * 文件存储服务实现类
 * 实现文件存储相关的所有业务逻辑
 * 负责处理用户上传的文件存储，包括艺术作品图片和用户头像
 * 提供文件的保存、删除等功能，并确保文件名的唯一性
 * 
 * @author Art Gallery Team
 */
@Service
public class FileStorageServiceImpl implements FileStorageService {

    /**
     * 艺术作品文件上传路径
     * 从配置文件中注入，用于存储艺术作品图片
     */
    @Value("${file.upload.artwork.path}")
    private String artworkUploadPath;

    /**
     * 用户头像上传路径
     * 从配置文件中注入，用于存储用户头像图片
     */
    @Value("${file.upload.avatar.path}")
    private String avatarUploadPath;

    /**
     * 服务初始化方法
     * 在Spring容器创建该Bean后自动执行，用于创建必要的上传目录
     * 如果目录不存在则自动创建，确保文件上传功能正常工作
     * 
     * @throws RuntimeException 当目录创建失败时抛出
     */
    @PostConstruct
    public void init() {
        try {
            // 创建艺术作品上传目录
            Files.createDirectories(Paths.get(artworkUploadPath));
            // 创建用户头像上传目录
            Files.createDirectories(Paths.get(avatarUploadPath));
        } catch (IOException e) {
            // 如果目录创建失败，抛出运行时异常阻止应用启动
            throw new RuntimeException("无法创建上传目录", e);
        }
    }

    /**
     * 存储艺术作品文件
     * 调用通用文件存储方法，将文件保存到艺术作品目录
     * 
     * @param file 上传的艺术作品图片文件
     * @return 文件的访问URL路径
     * @throws RuntimeException 当文件上传失败时抛出
     */
    @Override
    public String storeArtworkFile(MultipartFile file) {
        return storeFile(file, artworkUploadPath);
    }

    /**
     * 存储用户头像文件
     * 调用通用文件存储方法，将文件保存到头像目录
     * 
     * @param file 上传的用户头像文件
     * @return 文件的访问URL路径
     * @throws RuntimeException 当文件上传失败时抛出
     */
    @Override
    public String storeAvatarFile(MultipartFile file) {
        return storeFile(file, avatarUploadPath);
    }

    /**
     * 通用文件存储方法
     * 处理文件的实际存储逻辑，包括文件名生成和文件复制
     * 
     * @param file 上传的文件
     * @param uploadPath 存储路径
     * @return 文件的访问URL路径
     * @throws RuntimeException 当文件上传失败时抛出
     */
    private String storeFile(MultipartFile file, String uploadPath) {
        try {
            // 获取原始文件名
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            
            // 提取文件扩展名（如果存在）
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // 生成唯一的文件名（使用UUID避免文件名冲突）
            String newFilename = UUID.randomUUID().toString() + fileExtension;
            Path targetLocation = Paths.get(uploadPath).resolve(newFilename);

            // 将上传的文件复制到目标位置
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // 构建文件的访问URL路径
            // 从上传路径中提取目录名，构建RESTful风格的URL
            return "/uploads/" + uploadPath.split("/")[2] + "/" + newFilename;
        } catch (IOException e) {
            // 文件操作失败时抛出运行时异常
            throw new RuntimeException("文件上传失败: " + e.getMessage(), e);
        }
    }

    /**
     * 删除文件
     * 根据文件URL删除对应的物理文件
     * 
     * @param fileUrl 文件的访问URL
     * @throws RuntimeException 当文件删除失败时抛出
     */
    @Override
    public void deleteFile(String fileUrl) {
        try {
            // 从URL中提取文件名
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            
            // 根据URL判断文件类型并选择对应的存储路径
            String path = fileUrl.contains("avatars") ? avatarUploadPath : artworkUploadPath;
            Path filePath = Paths.get(path).resolve(filename);
            
            // 删除文件（如果存在）
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // 文件删除失败时抛出运行时异常
            throw new RuntimeException("文件删除失败: " + e.getMessage(), e);
        }
    }
}
