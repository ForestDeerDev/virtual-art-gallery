package com.artgallery.security;

import com.artgallery.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT认证过滤器
 * 从请求头中提取JWT令牌并验证，将用户信息存入SecurityContext
 * 
 * @author Art Gallery Team
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                    @NonNull HttpServletResponse response, 
                                    @NonNull FilterChain filterChain) 
            throws ServletException, IOException {
        
        String token = getTokenFromRequest(request);
        
        if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
            String username = jwtUtil.getUsernameFromToken(token);
            Long userId = jwtUtil.getUserIdFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);
            
            System.out.println("JWT Filter - Username: " + username + ", UserId: " + userId + ", Role: " + role);
            
            // 创建自定义Principal，包含userId
            UserPrincipal principal = new UserPrincipal(username, userId, role);
            
            // 创建认证对象
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(
                    principal, 
                    null, 
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                );
            
            System.out.println("JWT Filter - Authorities: " + authentication.getAuthorities());
            
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            // 设置到Security上下文
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            System.out.println("JWT Filter - No valid token for request: " + request.getRequestURI());
        }
        
        filterChain.doFilter(request, response);
    }

    /**
     * 判断是否应该跳过此过滤器
     * 对于公开访问的资源路径（如上传的图片），跳过JWT认证
     * 
     * @param request HTTP请求
     * @return true表示跳过过滤器，false表示执行过滤器
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getRequestURI();
        // 跳过上传文件的静态资源访问
        return path.startsWith("/uploads/");
    }

    /**
     * 从请求头中提取JWT令牌
     * 
     * @param request HTTP请求
     * @return JWT令牌
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

