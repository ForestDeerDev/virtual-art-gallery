package com.artgallery.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 错误响应数据传输对象
 * 用于统一格式化API错误响应，提供标准化的错误信息结构
 * 
 * 响应格式示例：
 * {
 *   "code": "USER_NOT_FOUND",
 *   "message": "用户不存在"
 * }
 * 
 * @author Art Gallery Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    /**
     * 错误代码
     * 用于程序化识别错误类型，便于前端处理
     * 常见错误代码：
     * - USER_NOT_FOUND: 用户不存在
     * - INVALID_PASSWORD: 密码错误
     * - UNAUTHORIZED: 未授权访问
     * - VALIDATION_ERROR: 参数验证失败
     * - INTERNAL_ERROR: 服务器内部错误
     */
    private String code;

    /**
     * 错误消息
     * 用于向用户显示具体的错误信息
     * 消息内容应该清晰易懂，帮助用户理解问题所在
     */
    private String message;
}

