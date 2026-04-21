package com.artgallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 评论DTO类
 * 
 * @author Art Gallery Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {

    /**
     * 评论ID
     */
    private Long id;

    /**
     * 评论用户信息
     */
    private UserDTO user;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 评论创建时间
     */
    private LocalDateTime createTime;

    /**
     * 父评论ID（用于回复功能）
     */
    private Long parentId;

    /**
     * 子评论列表
     */
    private List<CommentDTO> replies;

    /**
     * 子评论数量
     */
    private Integer replyCount;
}
