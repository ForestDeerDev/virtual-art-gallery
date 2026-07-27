package com.artgallery.dto;

import lombok.Data;

import java.util.List;

/**
 * 批量更新艺术作品请求DTO
 * 
 * @author Art Gallery Team
 */
@Data
public class BatchUpdateRequest {
    private List<BatchUpdateItem> updates;
}
