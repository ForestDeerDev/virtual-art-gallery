package com.artgallery.exception;

import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * 全局异常处理器
 * 统一处理系统中的各种异常，提供标准化的错误响应格式
 * 使用@RestControllerAdvice注解实现全局异常拦截
 * 
 * 处理的异常类型：
 * - BusinessException: 业务逻辑异常
 * - MethodArgumentNotValidException: 参数验证异常
 * - Exception: 其他未捕获的异常
 * 
 * @author Art Gallery Team
 */
@RestControllerAdvice
@SuppressWarnings("nullness")
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 处理文件上传异常
     * 捕获并处理文件上传过程中的异常，返回友好的错误信息
     * 详细错误信息记录到日志，不暴露给前端
     *
     * @param e 文件上传异常对象
     * @return 包含错误代码和友好消息的响应实体
     */
    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ErrorResponse> handleFileUploadException(FileUploadException e) {
        logger.warn("文件上传异常: code={}, message={}", e.getCode(), e.getMessage());
        ErrorResponse error = new ErrorResponse(e.getCode(), e.getMessage());
        return ResponseEntity.status(e.getHttpStatus()).body(error);
    }

    /**
     * 处理业务异常
     * 捕获并处理自定义的业务异常，返回对应的HTTP状态码和错误信息
     *
     * @param e 业务异常对象
     * @return 包含错误代码和消息的响应实体
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        logger.warn("业务异常: code={}, message={}", e.getCode(), e.getMessage());
        ErrorResponse error = new ErrorResponse(e.getCode(), e.getMessage());
        return ResponseEntity.status(e.getHttpStatus()).body(error);
    }

    /**
     * 处理参数验证异常
     * 当请求参数不符合@Valid注解的验证规则时触发
     * 收集所有字段验证错误，合并为统一的错误消息
     * 
     * @param e 参数验证异常对象
     * @return 包含验证错误详情的响应实体
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        // 遍历所有验证错误，收集字段名和错误消息
        e.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        // 构建详细的错误消息
        String message = "参数验证失败: " + errors.toString();
        ErrorResponse error = new ErrorResponse("VALIDATION_ERROR", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 处理实体未找到异常
     * 当JPA查询找不到实体时触发
     * 
     * @param e 实体未找到异常对象
     * @return 包含错误信息的响应实体
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException e) {
        ErrorResponse error = new ErrorResponse("ENTITY_NOT_FOUND", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * 处理安全异常
     * 当权限验证失败时触发
     * 
     * @param e 安全异常对象
     * @return 包含错误信息的响应实体
     */
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ErrorResponse> handleSecurityException(SecurityException e) {
        ErrorResponse error = new ErrorResponse("SECURITY_ERROR", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    /**
     * 处理其他未捕获的异常
     * 作为最后的异常处理兜底，防止系统异常信息泄露给前端
     * 详细错误信息记录到日志，前端只显示通用错误消息
     * 
     * @param e 异常对象
     * @return 通用错误响应
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        logger.error("未捕获的异常", e);
        ErrorResponse error = new ErrorResponse("INTERNAL_ERROR", "服务器内部错误，请稍后重试");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

