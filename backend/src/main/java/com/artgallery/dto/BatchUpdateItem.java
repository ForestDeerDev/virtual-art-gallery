package com.artgallery.dto;

import lombok.Data;

/**
 * 批量更新单项DTO
 * 包含作品ID和要更新的数据
 * 
 * @author Art Gallery Team
 */
@Data
public class BatchUpdateItem {
    private Long id;
    private ArtworkUpdateRequest data;
}
