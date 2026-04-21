package com.artgallery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * 统计信息DTO类
 * 用于返回系统统计数据
 * 
 * @author Art Gallery Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDTO {

    /**
     * 作品总数
     */
    private Long totalArtworks;

    /**
     * 用户总数
     */
    private Long totalUsers;

    /**
     * 总浏览量
     */
    private Long totalViews;

    /**
     * 总点赞数
     */
    private Long totalLikes;

    /**
     * 启用的作品数
     */
    private Long enabledArtworks;

    /**
     * 启用的用户数
     */
    private Long enabledUsers;

    /**
     * 精选作品数
     */
    private Long featuredArtworks;

    /**
     * 各分类作品统计
     */
    private Map<String, Long> categoryStats;

    /**
     * 各角色用户统计
     */
    private Map<String, Long> roleStats;
}
