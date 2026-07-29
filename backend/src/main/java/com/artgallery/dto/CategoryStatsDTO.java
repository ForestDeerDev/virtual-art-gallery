package com.artgallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 艺术分类统计DTO
 * 用于返回分类名称和对应的作品数量
 * 
 * @author Art Gallery Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryStatsDTO {

    /**
     * 分类名称（如：油画、水彩、素描等）
     */
    private String category;

    /**
     * 该分类下的作品数量
     */
    private Long count;
}
