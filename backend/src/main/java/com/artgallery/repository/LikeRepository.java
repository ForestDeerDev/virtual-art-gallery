package com.artgallery.repository;

import com.artgallery.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

/**
 * 点赞数据访问接口
 * 继承JpaRepository提供基本的CRUD操作，并定义了点赞相关的查询方法
 * 支持用户点赞状态查询、点赞统计和批量删除操作
 * 
 * @author Art Gallery Team
 */
public interface LikeRepository extends JpaRepository<Like, Long> {

    /**
     * 根据用户ID和作品ID查找点赞记录
     * 用于检查用户是否已点赞指定作品，防止重复点赞
     * 
     * @param userId 用户ID
     * @param artworkId 作品ID
     * @return 点赞记录的Optional包装，如果未点赞则返回Optional.empty()
     */
    Optional<Like> findByUserIdAndArtworkId(Long userId, Long artworkId);

    /**
     * 统计指定作品的总点赞数量
     * 通过统计点赞记录表获得准确的点赞数量
     * 
     * @param artworkId 作品ID
     * @return 点赞总数量
     */
    @Query("SELECT COUNT(l) FROM Like l WHERE l.artwork.id = ?1")
    Long countByArtworkId(Long artworkId);

    /**
     * 删除用户对指定作品的点赞记录
     * 用于取消点赞操作，支持精确删除特定用户的点赞
     * 
     * @param userId 用户ID
     * @param artworkId 作品ID
     */
    void deleteByUserIdAndArtworkId(Long userId, Long artworkId);
}
