package com.artgallery.dto;

import lombok.Data;

import java.util.List;

/**
 * 批量删除艺术作品请求DTO
 * 
 * @author Art Gallery Team
 */
@Data
public class BatchDeleteRequest {
    private List<Long> ids;
}
