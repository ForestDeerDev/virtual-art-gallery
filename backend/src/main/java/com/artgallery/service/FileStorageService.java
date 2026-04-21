package com.artgallery.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * 文件存储服务接口
 * 定义文件存储相关的所有业务操作
 * 
 * @author Art Gallery Team
 */
public interface FileStorageService {

    /**
     * 存储艺术作品文件
     * 
     * @param file 上传的艺术作品图片文件
     * @return 文件的访问URL路径
     */
    String storeArtworkFile(MultipartFile file);

    /**
     * 存储用户头像文件
     * 
     * @param file 上传的用户头像文件
     * @return 文件的访问URL路径
     */
    String storeAvatarFile(MultipartFile file);

    /**
     * 删除文件
     * 
     * @param fileUrl 文件的访问URL
     */
    void deleteFile(String fileUrl);
}
