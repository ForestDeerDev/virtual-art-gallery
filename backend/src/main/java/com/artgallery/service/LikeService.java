package com.artgallery.service;

/**
 * 点赞服务接口
 * 定义了用户对艺术作品点赞相关的所有业务操作
 * 支持点赞、取消点赞、点赞状态查询和点赞统计等功能
 * 
 * @author Art Gallery Team
 */
public interface LikeService {

    /**
     * 用户点赞艺术作品
     * 如果用户已经点赞过该作品，则不会重复点赞
     * 点赞成功后会自动更新作品的点赞计数
     * 
     * @param artworkId 作品ID，要点赞的作品
     * @param userId 用户ID，执行点赞操作的用户
     * @return 点赞后的作品总点赞数量
     * @throws IllegalArgumentException 当作品或用户不存在时抛出
     */
    Integer likeArtwork(Long artworkId, Long userId);

    /**
     * 用户取消点赞艺术作品
     * 如果用户没有点赞过该作品，则不会执行任何操作
     * 取消点赞后会自动更新作品的点赞计数
     * 
     * @param artworkId 作品ID，要取消点赞的作品
     * @param userId 用户ID，执行取消点赞操作的用户
     * @return 取消点赞后的作品总点赞数量
     * @throws IllegalArgumentException 当作品或用户不存在时抛出
     */
    Integer unlikeArtwork(Long artworkId, Long userId);

    /**
     * 检查用户是否已经点赞指定作品
     * 用于前端显示点赞状态（如按钮的高亮状态）
     * 
     * @param artworkId 作品ID
     * @param userId 用户ID
     * @return true如果用户已点赞该作品，false如果未点赞或作品/用户不存在
     */
    boolean isLikedByUser(Long artworkId, Long userId);

    /**
     * 获取艺术作品的总点赞数量
     * 统计指定作品的所有点赞数量，用于显示作品热度
     * 
     * @param artworkId 作品ID
     * @return 作品的总点赞数量，如果作品不存在返回0
     */
    Integer getLikeCount(Long artworkId);
}
