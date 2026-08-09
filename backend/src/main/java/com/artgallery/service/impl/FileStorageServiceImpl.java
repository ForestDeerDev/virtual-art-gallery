package com.artgallery.service.impl;

import com.artgallery.exception.FileUploadException;
import com.artgallery.service.FileStorageService;
import com.artgallery.util.ImageValidationUtil;
import jakarta.annotation.PostConstruct;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
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

    private static final Logger logger = LoggerFactory.getLogger(FileStorageServiceImpl.class);

    /**
     * 通用文件最大大小
     */
    @Value("${file.upload.max-size}")
    private long maxFileSize;

    /**
     * 通用允许的扩展名
     */
    @Value("${file.upload.allowed-extensions}")
    private List<String> allowedExtensions;

    /**
     * 通用允许的MIME类型
     */
    @Value("${file.upload.allowed-mime-types}")
    private List<String> allowedMimeTypes;

    /**
     * 通用最大像素数
     */
    @Value("${file.upload.max-pixels}")
    private long maxPixels;

    /**
     * 用户头像上传路径
     * 从配置文件中注入，用于存储用户头像图片
     */
    @Value("${file.upload.paths.avatar}")
    private String avatarUploadPath;

    /**
     * 艺术作品文件上传路径
     * 从配置文件中注入，用于存储艺术作品图片
     */
    @Value("${file.upload.paths.artwork}")
    private String artworkUploadPath;

    /**
     * Apache Tika 实例，用于检测文件真实类型
     * 通过构造函数注入
     */
    private final Tika tika;

    /**
     * 构造函数，注入 Tika 实例
     * 
     * @param tika Apache Tika 实例
     */
    public FileStorageServiceImpl(Tika tika) {
        this.tika = tika;
    }

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
     * @throws FileUploadException 当文件上传失败时抛出
     */
    @Override
    public String storeArtworkFile(MultipartFile file) {
        return storeFile(file, artworkUploadPath, maxFileSize, 
                        allowedExtensions, allowedMimeTypes, "artworks",
                        maxPixels);
    }

    /**
     * 存储用户头像文件
     * 调用通用文件存储方法，将文件保存到头像目录
     * 
     * @param file 上传的用户头像文件
     * @return 文件的访问URL路径
     * @throws FileUploadException 当文件上传失败时抛出
     */
    @Override
    public String storeAvatarFile(MultipartFile file) {
        return storeFile(file, avatarUploadPath, maxFileSize, 
                        allowedExtensions, allowedMimeTypes, "avatars",
                        maxPixels);
    }

    /**
     * 通用文件存储方法
     * 处理文件的实际存储逻辑，包括多层验证和文件保存
     * 
     * 验证流程：
     * 1. 文件为空检查
     * 2. 文件大小限制
     * 3. 扩展名白名单
     * 4. Tika检测真实MIME类型
     * 5. MIME白名单匹配
     * 6. ImageIO验证图片有效性
     * 7. 验证图片像素
     * 8. 生成UUID文件名
     * 9. 保存文件
     * 
     * @param file 上传的文件
     * @param uploadPath 存储路径
     * @param maxSize 最大允许大小（字节）
     * @param allowedExtensions 允许的扩展名列表
     * @param allowedMimeTypes 允许的MIME类型列表
     * @param urlPath URL路径标识（用于构建访问URL）
     * @param maxPixels 最大像素数
     * @return 文件的访问URL路径
     * @throws FileUploadException 当文件上传失败时抛出
     */
    private String storeFile(MultipartFile file, String uploadPath, long maxSize,
                           List<String> allowedExtensions, List<String> allowedMimeTypes,
                           String urlPath, long maxPixels) {
        try {
            // 1. 文件为空检查
            if (file == null || file.isEmpty()) {
                logger.warn("文件上传失败：文件为空");
                throw FileUploadException.fileEmpty();
            }

            // 2. 文件大小限制
            long fileSize = file.getSize();
            if (fileSize > maxSize) {
                logger.warn("文件上传失败：文件大小 {} 超过限制 {}", fileSize, maxSize);
                throw FileUploadException.fileSizeExceeded(maxSize);
            }

            // 获取原始文件名
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                logger.warn("文件上传失败：文件名为空");
                throw FileUploadException.fileEmpty();
            }

            // 提取文件扩展名（小写）
            String fileExtension = "";
            int lastDotIndex = originalFilename.lastIndexOf(".");
            if (lastDotIndex > 0 && lastDotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename
                        .substring(lastDotIndex + 1)
                        .trim()
                        .toLowerCase();
            }

            // 3. 扩展名白名单检查
            if (fileExtension.isEmpty() || !allowedExtensions.contains(fileExtension)) {
                logger.warn("文件上传失败：扩展名 {} 不在白名单中", fileExtension);
                throw FileUploadException.extensionNotAllowed(fileExtension);
            }

            // 4. 使用 Tika 检测文件真实 MIME 类型
            String detectedMimeType;
            try (var inputStream = file.getInputStream()) {
                detectedMimeType = tika.detect(inputStream);
            } catch (IOException e) {
                logger.error("文件上传失败：Tika 检测失败", e);
                throw FileUploadException.fileContentInvalid("无法检测文件类型");
            }

            logger.debug("检测到文件 MIME 类型: {}", detectedMimeType);

            // 5. MIME 白名单匹配
            if (!allowedMimeTypes.contains(detectedMimeType)) {
                logger.warn("文件上传失败：检测到的 MIME 类型 {} 不在白名单中", detectedMimeType);
                throw FileUploadException.fileTypeNotAllowed(detectedMimeType);
            }

            // 6. 验证图片有效性和像素
            ImageValidationUtil.validateImage(file, maxPixels);

            // 8. 生成安全的文件名（UUID + 扩展名）
            String safeExtension = "." + fileExtension;
            String newFilename = UUID.randomUUID().toString() + safeExtension;
            Path targetLocation = Paths.get(uploadPath).resolve(newFilename);

            // 9. 保存文件
            try (var inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            logger.info("文件上传成功：{} -> {}", originalFilename, newFilename);

            // 构建文件的访问URL路径
            return "/uploads/" + urlPath + "/" + newFilename;
        } catch (FileUploadException e) {
            throw e;
        } catch (IOException e) {
            logger.error("文件上传失败：IO 异常", e);
            throw new FileUploadException("FILE_UPLOAD_ERROR", "文件上传失败", 
                org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 删除文件
     * 根据文件URL删除对应的物理文件
     * 
     * @param fileUrl 文件的访问URL
     * @throws FileUploadException 当文件删除失败时抛出
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
            boolean deleted = Files.deleteIfExists(filePath);
            
            if (deleted) {
                logger.info("文件删除成功：{}", filename);
            } else {
                logger.warn("文件不存在，无需删除：{}", filename);
            }
        } catch (IOException e) {
            logger.error("文件删除失败：{}", fileUrl, e);
            throw new FileUploadException("FILE_DELETE_ERROR", "文件删除失败", 
                org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
