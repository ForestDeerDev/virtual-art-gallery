package com.artgallery.config;

import com.artgallery.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security安全配置
 * 
 * @author Art Gallery Team
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * 配置安全过滤器链
     * 
     * @param http HttpSecurity对象
     * @return SecurityFilterChain
     * @throws Exception 配置异常
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 禁用CSRF（因为使用JWT，不需要CSRF保护）
            .csrf(csrf -> csrf.disable())
            
            // 配置CORS
            .cors(cors -> {})
            
            // 配置会话管理为无状态（使用JWT，不需要Session）
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 配置请求授权
            .authorizeHttpRequests(auth -> auth
                // 公开访问的接口
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/artworks").permitAll()
                .requestMatchers(HttpMethod.GET, "/artworks/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/artworks/*").permitAll()
                .requestMatchers(HttpMethod.POST, "/artworks").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/artworks/*").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/artworks/*").hasAnyRole("USER", "ADMIN")
                // 互动相关接口
                .requestMatchers(HttpMethod.GET, "/interactions/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/interactions/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/interactions/**").hasAnyRole("USER", "ADMIN")
                // 其他接口
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/upload/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/user/info").authenticated()
                .requestMatchers("/user/**").authenticated()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            
            // 添加JWT认证过滤器
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * 配置密码编码器（使用BCrypt加密）
     * 
     * @return PasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 配置认证管理器
     * 
     * @param config AuthenticationConfiguration
     * @return AuthenticationManager
     * @throws Exception 配置异常
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

