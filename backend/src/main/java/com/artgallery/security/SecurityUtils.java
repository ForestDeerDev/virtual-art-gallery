package com.artgallery.security;

import com.artgallery.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Spring Security工具类
 * 提供从SecurityContextHolder获取当前用户信息的便捷方法
 * 
 * @author Art Gallery Team
 */
public class SecurityUtils {

    /**
     * 获取当前认证对象
     * 
     * @return Authentication对象
     */
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    /**
     * 获取当前用户Principal
     * 
     * @return UserPrincipal对象
     * @throws BusinessException 如果用户未认证或Principal类型不匹配
     */
    public static UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new BusinessException("UNAUTHORIZED", "用户未认证", HttpStatus.UNAUTHORIZED);
        }
        
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserPrincipal)) {
            throw new BusinessException("INTERNAL_ERROR", "Principal类型不匹配: " + principal.getClass().getName(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        return (UserPrincipal) principal;
    }

    /**
     * 获取当前用户ID
     * 
     * @return 用户ID
     * @throws BusinessException 如果用户未认证
     */
    public static Long getCurrentUserId() {
        return getCurrentUserPrincipal().getUserId();
    }

    /**
     * 获取当前用户名
     * 
     * @return 用户名
     * @throws BusinessException 如果用户未认证
     */
    public static String getCurrentUsername() {
        return getCurrentUserPrincipal().getUsername();
    }

    /**
     * 获取当前用户角色
     * 
     * @return 用户角色
     * @throws BusinessException 如果用户未认证
     */
    public static String getCurrentRole() {
        return getCurrentUserPrincipal().getRole();
    }

    /**
     * 检查当前用户是否已认证
     * 
     * @return 是否已认证
     */
    public static boolean isAuthenticated() {
        Authentication authentication = getAuthentication();
        return authentication != null && 
               authentication.isAuthenticated() && 
               !"anonymousUser".equals(authentication.getPrincipal());
    }
}
