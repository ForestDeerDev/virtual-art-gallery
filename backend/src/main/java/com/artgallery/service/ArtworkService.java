package com.artgallery.service;

import com.artgallery.dto.ArtworkCreateRequest;
import com.artgallery.dto.ArtworkDTO;
import com.artgallery.dto.ArtworkUpdateRequest;
import com.artgallery.dto.BatchUpdateItem;
import com.artgallery.dto.CategoryStatsDTO;
import com.artgallery.dto.PageResponse;

import java.util.List;

/**
 * 艺术作品服务接口
 * 定义艺术作品相关的所有业务操作
 * 
 * @author Art Gallery Team
 */
public interface ArtworkService {

    /**
     * 获取艺术作品列表（分页查询）
     * 
     * @param page 页码（从0开始）
     * @param pageSize 每页大小
     * @param category 分类筛选（可选）
     * @param sortBy 排序方式：latest（最新）、popular（最受欢迎）、title（标题）
     * @param tags 标签筛选（可选）
     * @param featured 是否推荐作品筛选（可选）
     * @return 分页响应，包含作品列表和分页信息
     */
    PageResponse<ArtworkDTO> getArtworks(Integer page, Integer pageSize, 
                                        String category, String sortBy, String tags, Boolean featured);

    /**
     * 获取艺术作品详情
     * 
     * @param id 作品ID
     * @return 作品DTO
     */
    ArtworkDTO getArtworkById(Long id);

    /**
     * 创建新的艺术作品
     * 
     * @param request 创建请求，包含作品的所有必要信息
     * @param artistId 艺术家ID（当前登录用户ID）
     * @return 创建成功的作品DTO
     */
    ArtworkDTO createArtwork(ArtworkCreateRequest request, Long artistId);

    /**
     * 更新艺术作品信息
     * 
     * @param id 作品ID
     * @param request 更新请求，包含要更新的字段
     * @param userId 当前用户ID
     * @return 更新后的作品DTO
     */
    ArtworkDTO updateArtwork(Long id, ArtworkUpdateRequest request, Long userId);

    /**
     * 删除艺术作品
     * 
     * @param id 作品ID
     * @param userId 当前用户ID
     */
    void deleteArtwork(Long id, Long userId);

    /**
     * 批量删除艺术作品
     * 
     * @param ids 作品ID列表
     * @param userId 当前用户ID
     */
    void batchDeleteArtworks(List<Long> ids, Long userId);

    /**
     * 批量更新艺术作品
     * 
     * @param updates 更新列表，每个元素包含作品ID和要更新的字段
     * @param userId 当前用户ID
     */
    void batchUpdateArtworks(List<BatchUpdateItem> updates, Long userId);

    /**
     * 搜索艺术作品
     * 
     * @param keyword 搜索关键词
     * @param page 页码（从0开始）
     * @param pageSize 每页大小
     * @return 分页响应，包含匹配的作品列表
     */
    PageResponse<ArtworkDTO> searchArtworks(String keyword, Integer page, Integer pageSize);

    /**
     * 获取个性化推荐作品
     * 
     * @param userId 用户ID
     * @return 推荐作品列表
     */
    List<ArtworkDTO> getRecommendations(Long userId);

    /**
     * 获取所有启用的作品分类列表
     * 
     * @return 所有分类名称列表，按字母顺序排序
     */
    List<String> getCategories();

    /**
     * 获取所有分类的作品数量统计
     * 
     * @return 分类统计列表，每个元素包含分类名称和作品数量
     */
    List<CategoryStatsDTO> getCategoryStats();
}
