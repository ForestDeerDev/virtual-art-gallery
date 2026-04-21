package com.artgallery.service;

import com.artgallery.dto.CommentCreateRequest;
import com.artgallery.dto.CommentDTO;

import java.util.List;

/**
 * 评论服务接口
 * 定义了评论相关的所有业务操作，包括评论的创建、查询、删除等功能
 * 支持多层级评论结构（顶层评论和回复评论）
 * 
 * @author Art Gallery Team
 */
public interface CommentService {

    /**
     * 创建新评论
     * 用户可以对艺术作品发表评论，支持顶层评论和回复评论
     * 
     * @param artworkId 作品ID，要评论的作品
     * @param userId 用户ID，发表评论的用户
     * @param request 评论创建请求，包含评论内容和父评论ID等信息
     * @return 创建成功的评论DTO，包含完整的评论信息
     */
    CommentDTO createComment(Long artworkId, Long userId, CommentCreateRequest request);

    /**
     * 获取作品的所有顶层评论
     * 顶层评论指直接回复作品的评论，不包含回复其他评论的子评论
     * 通常按创建时间倒序排列，最新的评论在前
     * 
     * @param artworkId 作品ID
     * @return 顶层评论列表，按创建时间倒序排列
     */
    List<CommentDTO> getTopLevelCommentsByArtworkId(Long artworkId);

    /**
     * 获取指定评论的所有子评论（回复）
     * 子评论指回复其他评论的评论，形成多层级评论结构
     * 
     * @param commentId 父评论ID
     * @return 子评论列表，按创建时间正序排列（最早的回复在前）
     */
    List<CommentDTO> getRepliesByCommentId(Long commentId);

    /**
     * 删除评论
     * 支持删除自己的评论，管理员可以删除任何评论
     * 删除评论时会同时删除其所有子评论（级联删除）
     * 
     * @param commentId 要删除的评论ID
     * @param userId 当前操作用户的ID，用于权限验证
     * @throws SecurityException 当用户无权限删除评论时抛出
     */
    void deleteComment(Long commentId, Long userId);

    /**
     * 获取作品的总评论数量
     * 统计指定作品的所有评论数量，包括顶层评论和子评论
     * 用于显示评论统计信息
     * 
     * @param artworkId 作品ID
     * @return 评论总数量，如果作品不存在返回0
     */
    Long getCommentCountByArtworkId(Long artworkId);
}
