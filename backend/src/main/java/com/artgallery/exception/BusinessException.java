package com.artgallery.exception;

import org.springframework.http.HttpStatus;

/**
 * 业务异常类
 * 用于处理系统中的业务逻辑异常，提供统一的错误处理机制
 * 继承自RuntimeException，支持自定义错误代码和HTTP状态码
 * 
 * 使用场景：
 * - 用户不存在或密码错误
 * - 权限不足
 * - 资源不存在
 * - 业务规则验证失败
 * 
 * @author Art Gallery Team
 */
public class BusinessException extends RuntimeException {

    /**
     * 错误代码
     * 用于前端识别具体的错误类型
     */
    private final String code;
    
    /**
     * HTTP状态码
     * 用于确定响应的HTTP状态
     */
    private final HttpStatus httpStatus;

    /**
     * 构造函数 - 使用默认HTTP状态码(400 Bad Request)
     * 
     * @param code 错误代码，如"USER_NOT_FOUND"
     * @param message 错误消息，用于显示给用户
     */
    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }

    /**
     * 构造函数 - 自定义HTTP状态码
     * 
     * @param code 错误代码，如"UNAUTHORIZED"
     * @param message 错误消息，用于显示给用户
     * @param httpStatus HTTP状态码，如401 Unauthorized
     */
    public BusinessException(String code, String message, HttpStatus httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }

    /**
     * 获取错误代码
     * 
     * @return 错误代码字符串
     */
    public String getCode() {
        return code;
    }

    /**
     * 获取HTTP状态码
     * 
     * @return HTTP状态码对象
     */
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}

