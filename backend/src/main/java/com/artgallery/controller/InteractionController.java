package com.artgallery.controller;

import com.artgallery.dto.CommentCreateRequest;
import com.artgallery.dto.CommentDTO;
import com.artgallery.security.SecurityUtils;
import com.artgallery.service.CommentService;
import com.artgallery.service.LikeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 互动控制器
 * 处理点赞、评论等用户互动相关的RESTful API请求
 * 
 * @author Art Gallery Team
 */
@RestController
@RequestMapping("/interactions")
public class InteractionController {

    private final LikeService likeService;
    private final CommentService commentService;

    public InteractionController(LikeService likeService, CommentService commentService) {
        this.likeService = likeService;
        this.commentService = commentService;
    }

    /**
     * 点赞作品
     * 
     * POST /api/interactions/artworks/{id}/like
     * 
     * @param artworkId 作品ID
     * @param request HTTP请求
     * @return 当前点赞数量
     */
    @PostMapping("/artworks/{id}/like")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, Integer>> likeArtwork(@PathVariable("id") Long artworkId) {
        Long userId = SecurityUtils.getCurrentUserId();
        Integer likeCount = likeService.likeArtwork(artworkId, userId);
        return ResponseEntity.ok(Map.of("likeCount", likeCount));
    }

    /**
     * 取消点赞作品
     * 
     * DELETE /api/interactions/artworks/{id}/like
     * 
     * @param artworkId 作品ID
     * @param request HTTP请求
     * @return 当前点赞数量
     */
    @DeleteMapping("/artworks/{id}/like")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, Integer>> unlikeArtwork(@PathVariable("id") Long artworkId) {
        Long userId = SecurityUtils.getCurrentUserId();
        Integer likeCount = likeService.unlikeArtwork(artworkId, userId);
        return ResponseEntity.ok(Map.of("likeCount", likeCount));
    }

    /**
     * 检查用户是否已点赞作品
     * 
     * GET /api/interactions/artworks/{id}/like/status
     * 
     * @param artworkId 作品ID
     * @param request HTTP请求
     * @return 是否已点赞
     */
    @GetMapping("/artworks/{id}/like/status")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, Boolean>> checkLikeStatus(@PathVariable("id") Long artworkId) {
        Long userId = SecurityUtils.getCurrentUserId();
        boolean isLiked = likeService.isLikedByUser(artworkId, userId);
        return ResponseEntity.ok(Map.of("isLiked", isLiked));
    }

    /**
     * 获取作品点赞数量
     * 
     * GET /api/interactions/artworks/{id}/like/count
     * 
     * @param artworkId 作品ID
     * @return 点赞数量
     */
    @GetMapping("/artworks/{id}/like/count")
    public ResponseEntity<Map<String, Integer>> getLikeCount(@PathVariable("id") Long artworkId) {
        Integer likeCount = likeService.getLikeCount(artworkId);
        return ResponseEntity.ok(Map.of("likeCount", likeCount));
    }

    /**
     * 创建评论
     * 
     * POST /api/interactions/artworks/{id}/comments
     * 
     * @param artworkId 作品ID
     * @param commentRequest 评论请求
     * @param request HTTP请求
     * @return 创建的评论
     */
    @PostMapping("/artworks/{id}/comments")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable("id") Long artworkId,
            @Valid @RequestBody CommentCreateRequest commentRequest) {
        Long userId = SecurityUtils.getCurrentUserId();
        CommentDTO comment = commentService.createComment(artworkId, userId, commentRequest);
        return ResponseEntity.ok(comment);
    }

    /**
     * 获取作品的顶层评论列表
     * 
     * GET /api/interactions/artworks/{id}/comments
     * 
     * @param artworkId 作品ID
     * @return 评论列表
     */
    @GetMapping("/artworks/{id}/comments")
    public ResponseEntity<List<CommentDTO>> getTopLevelComments(@PathVariable("id") Long artworkId) {
        List<CommentDTO> comments = commentService.getTopLevelCommentsByArtworkId(artworkId);
        return ResponseEntity.ok(comments);
    }

    /**
     * 获取评论的回复列表
     * 
     * GET /api/interactions/comments/{id}/replies
     * 
     * @param commentId 评论ID
     * @return 回复列表
     */
    @GetMapping("/comments/{id}/replies")
    public ResponseEntity<List<CommentDTO>> getReplies(@PathVariable("id") Long commentId) {
        List<CommentDTO> replies = commentService.getRepliesByCommentId(commentId);
        return ResponseEntity.ok(replies);
    }

    /**
     * 删除评论
     * 
     * DELETE /api/interactions/comments/{id}
     * 
     * @param commentId 评论ID
     * @param request HTTP请求
     * @return 成功响应
     */
    @DeleteMapping("/comments/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> deleteComment(@PathVariable("id") Long commentId) {
        Long userId = SecurityUtils.getCurrentUserId();
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 获取作品评论数量
     * 
     * GET /api/interactions/artworks/{id}/comments/count
     * 
     * @param artworkId 作品ID
     * @return 评论数量
     */
    @GetMapping("/artworks/{id}/comments/count")
    public ResponseEntity<Map<String, Long>> getCommentCount(@PathVariable("id") Long artworkId) {
        Long commentCount = commentService.getCommentCountByArtworkId(artworkId);
        return ResponseEntity.ok(Map.of("commentCount", commentCount));
    }

}
