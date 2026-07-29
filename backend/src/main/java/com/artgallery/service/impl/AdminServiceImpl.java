package com.artgallery.service.impl;

import com.artgallery.dto.CategoryStatsDTO;
import com.artgallery.dto.StatsDTO;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.AdminService;
import com.artgallery.service.ArtworkService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 管理员服务实现类
 * 实现管理员专用的系统统计和管理功能
 * 包含用户统计、作品统计、分类统计等数据分析功能
 * 
 * @author Art Gallery Team
 */
@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    /**
     * 艺术作品数据访问层
     * 用于查询作品相关的统计数据
     */
    private final ArtworkRepository artworkRepository;

    /**
     * 用户数据访问层
     * 用于查询用户相关的统计数据
     */
    private final UserRepository userRepository;

    /**
     * 艺术作品服务
     * 用于获取作品分类统计数据
     */
    private final ArtworkService artworkService;

    public AdminServiceImpl(ArtworkRepository artworkRepository, UserRepository userRepository, ArtworkService artworkService) {
        this.artworkRepository = artworkRepository;
        this.userRepository = userRepository;
        this.artworkService = artworkService;
    }

    /**
     * 获取系统综合统计信息
     * 包括用户数、作品数、浏览量、点赞量等多维度数据
     * 
     * @return 统计信息DTO，包含所有系统统计数据
     */
    @Override
    public StatsDTO getStats() {
        StatsDTO stats = new StatsDTO();

        // 获取总作品数量
        stats.setTotalArtworks(artworkRepository.count());
        
        // 获取总用户数量
        stats.setTotalUsers(userRepository.count());

        // 获取总浏览量（处理可能的null值）
        Long totalViews = artworkRepository.sumViewCount();
        stats.setTotalViews(totalViews != null ? totalViews : 0L);

        // 获取总点赞量（处理可能的null值）
        Long totalLikes = artworkRepository.sumLikeCount();
        stats.setTotalLikes(totalLikes != null ? totalLikes : 0L);

        // 获取启用状态的作品数量
        stats.setEnabledArtworks(artworkRepository.countByEnabled(true));
        
        // 获取启用状态的用户数量
        stats.setEnabledUsers(userRepository.countByEnabled(true));

        // 获取推荐且启用状态的作品数量
        stats.setFeaturedArtworks(artworkRepository.countByFeaturedAndEnabled(true, true));

        // 获取按分类统计的作品数据（复用 ArtworkService 的方法）
        List<CategoryStatsDTO> categoryStatsList = artworkService.getCategoryStats();
        Map<String, Long> categoryStats = categoryStatsList.stream()
            .collect(Collectors.toMap(
                CategoryStatsDTO::getCategory,
                CategoryStatsDTO::getCount
            ));
        stats.setCategoryStats(categoryStats);

        // 获取按角色统计的用户数据
        stats.setRoleStats(getRoleStats());

        return stats;
    }

    /**
     * 获取按角色统计的用户数量
     * 查询各个角色下的用户数量，用于用户权限分析
     * 
     * @return 角色统计Map，key为角色名称，value为该角色下的用户数量
     */
    private Map<String, Long> getRoleStats() {
        Map<String, Long> roleStats = new HashMap<>();
        
        // 从数据库查询各角色的用户数量统计
        List<Object[]> results = userRepository.countByRole();
        
        // 处理查询结果，将数据转换为Map格式
        for (Object[] result : results) {
            String role = result[0] != null ? result[0].toString() : null;
            Long count = result[1] != null ? ((Number) result[1]).longValue() : 0L;
            roleStats.put(role, count);
        }
        
        return roleStats;
    }
}
