package com.artgallery.dto;

import com.artgallery.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户DTO
 * 
 * @author Art Gallery Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private String avatar;
    private UserRole role;
    private List<String> tags;
    private Boolean enabled;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}

