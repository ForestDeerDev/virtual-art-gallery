package com.artgallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 头像上传响应DTO
 * 
 * @author Art Gallery Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvatarResponse {
    private String avatarUrl;
}
