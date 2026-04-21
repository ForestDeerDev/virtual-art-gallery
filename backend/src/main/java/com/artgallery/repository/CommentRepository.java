package com.artgallery.repository;

import com.artgallery.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 评论数据访问接口
 * 继承JpaRepository提供基本的CRUD操作，并定义了评论相关的查询方法
 * 支持多层级评论结构（顶层评论和子评论）的查询和统计
 * 
 * @author Art Gallery Team
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * 根据作品ID查找所有顶层评论
     * 顶层评论指直接回复作品的评论（parent为null的评论）
     * 按创建时间倒序排列，最新的评论在前
     * 
     * @param artworkId 作品ID
     * @return 顶层评论列表，按创建时间倒序排列
     */
    @Query("SELECT c FROM Comment c WHERE c.artwork.id = ?1 AND c.parent IS NULL ORDER BY c.createTime DESC")
    List<Comment> findTopLevelCommentsByArtworkId(Long artworkId);

    /**
     * 统计指定作品的总评论数量
     * 包括所有顶层评论和子评论的数量统计
     * 
     * @param artworkId 作品ID
     * @return 评论总数量
     */
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.artwork.id = ?1")
    Long countByArtworkId(Long artworkId);

    /**
     * 根据父评论ID查找所有子评论
     * 子评论指回复其他评论的评论，形成多层级评论结构
     * 按创建时间正序排列，最早的回复在前
     * 
     * @param parentId 父评论ID
     * @return 子评论列表，按创建时间正序排列
     */
    @Query("SELECT c FROM Comment c WHERE c.parent.id = ?1 ORDER BY c.createTime ASC")
    List<Comment> findByParentId(Long parentId);
}
