package com.artgallery.dto;

import lombok.Data;

/**
 * 评论创建请求DTO类
 * 
 * @author Art Gallery Team
 */
@Data
public class CommentCreateRequest {

    /**
     * 评论内容，不能为空
     */
    private String content;

    /**
     * 父评论ID（用于回复功能，可为空）
     */
    private Long parentId;
}
