package com.artgallery.exception;

import org.springframework.http.HttpStatus;

/**
 * 文件上传异常类
 * 用于处理文件上传过程中的各种错误
 * 继承自BusinessException，支持自定义错误代码和HTTP状态码
 * 
 * 使用场景：
 * - 文件为空
 * - 文件大小超限
 * - 文件类型不允许
 * - 文件内容验证失败
 * 
 * @author Art Gallery Team
 */
public class FileUploadException extends BusinessException {

    /**
     * 错误代码常量
     */
    public static final String FILE_EMPTY = "FILE_EMPTY";
    public static final String FILE_SIZE_EXCEEDED = "FILE_SIZE_EXCEEDED";
    public static final String FILE_TYPE_NOT_ALLOWED = "FILE_TYPE_NOT_ALLOWED";
    public static final String FILE_CONTENT_INVALID = "FILE_CONTENT_INVALID";
    public static final String FILE_EXTENSION_NOT_ALLOWED = "FILE_EXTENSION_NOT_ALLOWED";

    /**
     * 构造函数 - 使用默认HTTP状态码(400 Bad Request)
     * 
     * @param code 错误代码
     * @param message 错误消息（用于前端显示）
     */
    public FileUploadException(String code, String message) {
        super(code, message);
    }

    /**
     * 构造函数 - 自定义HTTP状态码
     * 
     * @param code 错误代码
     * @param message 错误消息（用于前端显示）
     * @param httpStatus HTTP状态码
     */
    public FileUploadException(String code, String message, HttpStatus httpStatus) {
        super(code, message, httpStatus);
    }

    /**
     * 文件为空异常
     * 
     * @return FileUploadException
     */
    public static FileUploadException fileEmpty() {
        return new FileUploadException(FILE_EMPTY, "文件不能为空");
    }

    /**
     * 文件大小超限异常
     * 
     * @param maxSize 最大允许大小（字节）
     * @return FileUploadException
     */
    public static FileUploadException fileSizeExceeded(long maxSize) {
        String maxSizeMB = String.format("%.2f", maxSize / (1024.0 * 1024.0));
        return new FileUploadException(FILE_SIZE_EXCEEDED, 
            "文件大小超过限制，最大允许 " + maxSizeMB + "MB");
    }

    /**
     * 文件扩展名不允许异常
     * 
     * @param extension 文件扩展名
     * @return FileUploadException
     */
    public static FileUploadException extensionNotAllowed(String extension) {
        return new FileUploadException(FILE_EXTENSION_NOT_ALLOWED, 
            "文件扩展名 " + extension + " 不支持");
    }

    /**
     * 文件类型不允许异常
     * 
     * @param mimeType 检测到的MIME类型
     * @return FileUploadException
     */
    public static FileUploadException fileTypeNotAllowed(String mimeType) {
        return new FileUploadException(FILE_TYPE_NOT_ALLOWED, 
            "文件类型 " + mimeType + " 不支持");
    }

    /**
     * 文件内容无效异常
     * 
     * @param reason 详细原因（用于日志记录）
     * @return FileUploadException
     */
    public static FileUploadException fileContentInvalid(String reason) {
        String message = (reason == null || reason.isBlank())
                ? "文件内容验证失败"
                : "文件内容验证失败：" + reason;

        return new FileUploadException(FILE_CONTENT_INVALID, message);
    }
}
