package com.artgallery.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * 创建艺术作品请求DTO
 * 
 * @author Art Gallery Team
 */
@Data
public class ArtworkCreateRequest {

    @NotBlank(message = "标题不能为空")
    private String title;

    @NotBlank(message = "分类不能为空")
    private String category;

    private String description;
    private String imageUrl;
    private String videoUrl;
    private List<String> tags;
    private String dimensions;
    private String material;
    private Boolean featured = false;
}

