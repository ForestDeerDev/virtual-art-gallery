package com.artgallery.util;

import com.artgallery.exception.FileUploadException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

/**
 * 图片验证工具类
 * 使用ImageIO验证图片文件的有效性和完整性
 * 
 * @author Art Gallery Team
 */
public class ImageValidationUtil {

    private static final Logger logger = LoggerFactory.getLogger(ImageValidationUtil.class);

    /**
     * 验证图片总像素
     * 
     * @param file 上传的图片文件
     * @param maxPixels 最大总像素数
     * @throws FileUploadException 当图片无效或像素过大时抛出
     */
    public static void validateImage(MultipartFile file, long maxPixels) {
        BufferedImage image;
        try (var inputStream = file.getInputStream()) {
            image = ImageIO.read(inputStream);
        } catch (IOException e) {
            logger.debug("图片验证失败：{}", e.getMessage());
            throw FileUploadException.fileContentInvalid("图片无效");
        }

        if (image == null) {
            throw FileUploadException.fileContentInvalid("图片无效");
        }

        int width = image.getWidth();
        int height = image.getHeight();

        long pixels = (long) width * height;
        if (pixels > maxPixels) {
            throw FileUploadException.fileContentInvalid("图片像素过大");
        }
    }
}
