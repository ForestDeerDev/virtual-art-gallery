package com.artgallery.service.impl;

import com.artgallery.dto.*;
import com.artgallery.entity.Artwork;
import com.artgallery.entity.User;
import com.artgallery.entity.UserRole;
import com.artgallery.exception.BusinessException;
import com.artgallery.mapper.ArtworkMapper;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.ArtworkService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;

/**
 * 艺术作品服务实现类
 * 实现艺术作品相关的所有业务逻辑，包括作品的增删改查、搜索、推荐等功能
 * 支持分页查询、条件筛选、权限控制等复杂业务场景
 * 
 * @author Art Gallery Team
 */
@Service
@Transactional
@SuppressWarnings("nullness")
public class ArtworkServiceImpl implements ArtworkService {

    /**
     * 艺术作品数据访问层
     * 负责作品的数据库操作
     */
    private final ArtworkRepository artworkRepository;

    /**
     * 用户数据访问层
     * 负责用户信息的查询和权限验证
     */
    private final UserRepository userRepository;

    /**
     * 艺术作品映射器
     * 负责实体与DTO之间的转换
     */
    private final ArtworkMapper artworkMapper;

    public ArtworkServiceImpl(ArtworkRepository artworkRepository, UserRepository userRepository, ArtworkMapper artworkMapper) {
        this.artworkRepository = artworkRepository;
        this.userRepository = userRepository;
        this.artworkMapper = artworkMapper;
    }

    /**
     * 获取艺术作品列表（分页查询）
     * 支持多种筛选条件和排序方式，为前端提供灵活的数据查询接口
     * 
     * @param page 页码（从0开始）
     * @param pageSize 每页大小
     * @param category 分类筛选（可选）
     * @param sortBy 排序方式：latest（最新）、popular（最受欢迎）、title（标题）
     * @param tags 标签筛选（可选）
     * @param featured 是否推荐作品筛选（可选）
     * @return 分页响应，包含作品列表和分页信息
     */
    public PageResponse<ArtworkDTO> getArtworks(Integer page, Integer pageSize, 
                                                String category, String sortBy, String tags, Boolean featured) {
        // 设置默认分页参数
        if (page == null || page < 0) page = 0;
        if (pageSize == null || pageSize <= 0) pageSize = 12;

        // 构建排序规则
        Sort sort = Sort.by(Sort.Direction.DESC, "createTime");
        if ("popular".equals(sortBy)) {
            // 按热度排序：先按浏览量，再按点赞量
            sort = Sort.by(Sort.Direction.DESC, "viewCount", "likeCount");
        } else if ("title".equals(sortBy)) {
            // 按标题升序排序
            sort = Sort.by(Sort.Direction.ASC, "title");
        }

        // 创建分页对象
        Pageable pageable = PageRequest.of(page, pageSize, sort);
        Page<Artwork> artworkPage;

        // 根据筛选条件执行不同的查询策略
        if (featured != null && featured) {
            // 查询推荐且启用的作品
            artworkPage = artworkRepository.findByFeaturedAndEnabled(true, true, pageable);
        } else if (category != null && !category.trim().isEmpty()) {
            // 按分类筛选启用的作品
            artworkPage = artworkRepository.findByCategoryAndEnabled(category.trim(), true, pageable);
        } else if (tags != null && !tags.trim().isEmpty()) {
            // 按标签筛选启用的作品
            artworkPage = artworkRepository.findByTag(tags.trim(), true, pageable);
        } else {
            // 查询所有启用的作品
            artworkPage = artworkRepository.findByEnabled(true, pageable);
        }

        // 将实体对象转换为DTO对象，避免暴露内部数据结构
        List<ArtworkDTO> artworkDTOs = artworkPage.getContent().stream()
            .map(artworkMapper::toDto)
            .collect(Collectors.toList());

        // 构建分页响应对象，页码从1开始返回给前端
        return new PageResponse<>(
            artworkDTOs,
            page + 1,  // 前端页码从1开始
            pageSize,
            artworkPage.getTotalElements(),
            artworkPage.getTotalPages(),
            artworkPage.hasPrevious(),
            artworkPage.hasNext()
        );
    }

    /**
     * 获取艺术作品详情
     * 查询指定ID的作品信息，并自动增加浏览量统计
     * 
     * @param id 作品ID
     * @return 作品DTO
     * @throws BusinessException 当作品不存在时抛出
     */
    public ArtworkDTO getArtworkById(Long id) {
        // 查询作品，如果不存在则抛出业务异常
        Artwork artwork = artworkRepository.findById(id)
            .orElseThrow(() -> new BusinessException("ARTWORK_NOT_FOUND", "作品不存在"));

        // 增加作品浏览量（每次查看都计数）
        artwork.setViewCount(artwork.getViewCount() + 1);
        artworkRepository.save(artwork);

        return artworkMapper.toDto(artwork);
    }

    /**
     * 创建新的艺术作品
     * 验证用户权限后创建作品，设置默认值并保存到数据库
     * 
     * @param request 创建请求，包含作品的所有必要信息
     * @param artistId 艺术家ID（当前登录用户ID）
     * @return 创建成功的作品DTO
     * @throws BusinessException 当用户不存在时抛出
     */
    public ArtworkDTO createArtwork(ArtworkCreateRequest request, Long artistId) {
        // 验证艺术家用户是否存在
        User artist = userRepository.findById(artistId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        // 创建新的艺术作品对象
        Artwork artwork = new Artwork();
        artwork.setTitle(request.getTitle());
        artwork.setArtist(artist);
        artwork.setCategory(request.getCategory());
        artwork.setDescription(request.getDescription());
        artwork.setImageUrl(request.getImageUrl());
        artwork.setVideoUrl(request.getVideoUrl());
        artwork.setDimensions(request.getDimensions());
        artwork.setMaterial(request.getMaterial());
        
        // 设置推荐状态，默认为false
        artwork.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);
        
        // 设置作品状态和初始统计数据
        artwork.setEnabled(true);
        artwork.setViewCount(0);
        artwork.setLikeCount(0);

        // 设置作品标签（如果提供）
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            artwork.setTagsList(request.getTags());
        }

        // 保存作品到数据库
        artwork = artworkRepository.save(artwork);
        return artworkMapper.toDto(artwork);
    }

    /**
     * 更新艺术作品信息
     * 支持部分更新，只有提供的字段才会被更新
     * 包含完整的权限验证逻辑
     * 
     * @param id 作品ID
     * @param request 更新请求，包含要更新的字段
     * @param userId 当前用户ID
     * @return 更新后的作品DTO
     * @throws BusinessException 当作品不存在或无权限时抛出
     */
    public ArtworkDTO updateArtwork(Long id, ArtworkUpdateRequest request, Long userId) {
        // 查询要更新的作品
        Artwork artwork = artworkRepository.findById(id)
            .orElseThrow(() -> new BusinessException("ARTWORK_NOT_FOUND", "作品不存在"));

        // 验证权限
        verifyArtworkPermission(artwork, userId, "修改");

        // 逐个更新字段（只更新非null的字段，支持部分更新）
        if (request.getTitle() != null) {
            artwork.setTitle(request.getTitle());
        }
        if (request.getCategory() != null) {
            artwork.setCategory(request.getCategory());
        }
        if (request.getDescription() != null) {
            artwork.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            artwork.setImageUrl(request.getImageUrl());
        }
        if (request.getVideoUrl() != null) {
            artwork.setVideoUrl(request.getVideoUrl());
        }
        if (request.getDimensions() != null) {
            artwork.setDimensions(request.getDimensions());
        }
        if (request.getMaterial() != null) {
            artwork.setMaterial(request.getMaterial());
        }
        if (request.getFeatured() != null) {
            artwork.setFeatured(request.getFeatured());
        }
        if (request.getEnabled() != null) {
            artwork.setEnabled(request.getEnabled());
        }
        if (request.getTags() != null) {
            artwork.setTagsList(request.getTags());
        }

        // 保存更新后的作品
        artwork = artworkRepository.save(artwork);
        return artworkMapper.toDto(artwork);
    }

    /**
     * 删除艺术作品
     * 包含权限验证，确保只有有权限的用户才能删除作品
     * 
     * @param id 作品ID
     * @param userId 当前用户ID
     * @throws BusinessException 当作品不存在或无权限时抛出
     */
    public void deleteArtwork(Long id, Long userId) {
        // 查询要删除的作品
        Artwork artwork = artworkRepository.findById(id)
            .orElseThrow(() -> new BusinessException("ARTWORK_NOT_FOUND", "作品不存在"));

        // 验证权限
        verifyArtworkPermission(artwork, userId, "删除");

        // 执行删除操作
        artworkRepository.delete(artwork);
    }

    /**
     * 批量删除艺术作品
     * 支持一次删除多个作品，提高操作效率
     * 对每个作品都进行权限验证
     * 
     * @param ids 作品ID列表
     * @param userId 当前用户ID
     * @throws BusinessException 当作品不存在或无权限时抛出
     */
    public void batchDeleteArtworks(List<Long> ids, Long userId) {
        // 批量查询要删除的作品
        List<Artwork> artworks = artworkRepository.findByIdIn(ids);
        
        // 逐个检查权限，确保用户有权限删除所有作品
        for (Artwork artwork : artworks) {
            verifyArtworkPermission(artwork, userId, "删除作品：" + artwork.getTitle());
        }

        // 批量删除作品
        artworkRepository.deleteAll(artworks);
    }

    /**
     * 验证用户对作品的操作权限
     * 管理员可以操作所有作品，普通用户只能操作自己的作品
     * 
     * @param artwork 要操作的作品
     * @param userId 当前用户ID
     * @param operation 操作名称（用于错误消息）
     * @throws BusinessException 当无权限时抛出
     */
    private void verifyArtworkPermission(Artwork artwork, Long userId, String operation) {
        User currentUser = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        
        if (!UserRole.ADMIN.equals(currentUser.getRole()) && !artwork.getArtist().getId().equals(userId)) {
            throw new BusinessException("PERMISSION_DENIED", "无权" + operation + "此作品");
        }
    }

    /**
     * 批量更新艺术作品
     * 支持一次更新多个作品，通常用于管理员批量操作
     * 注意：当前实现为占位符，需要根据实际需求完善
     * 
     * @param updates 更新列表，每个元素包含作品ID和要更新的字段
     * @param userId 当前用户ID
     * @throws BusinessException 当作品不存在或无权限时抛出
     */
    @SuppressWarnings("unused")
    public void batchUpdateArtworks(List<ArtworkUpdateRequest> updates, Long userId) {
        for (ArtworkUpdateRequest update : updates) {
            // TODO: 完善批量更新逻辑
            // 这里简化处理，实际应该从update中获取id并调用updateArtwork方法
            // 需要修改DTO结构来支持批量更新，确保包含作品ID
        }
    }

    /**
     * 搜索艺术作品
     * 根据关键词在作品标题中进行全文搜索，支持分页返回结果
     * 
     * @param keyword 搜索关键词
     * @param page 页码（从0开始）
     * @param pageSize 每页大小
     * @return 分页响应，包含匹配的作品列表
     */
    public PageResponse<ArtworkDTO> searchArtworks(String keyword, Integer page, Integer pageSize) {
        // 设置默认分页参数
        if (page == null || page < 0) page = 0;
        if (pageSize == null || pageSize <= 0) pageSize = 12;

        // 创建分页对象
        Pageable pageable = PageRequest.of(page, pageSize);
        
        // 执行标题搜索查询
        Page<Artwork> artworkPage = artworkRepository.searchByTitle(keyword, pageable);

        // 转换为DTO对象
        List<ArtworkDTO> artworkDTOs = artworkPage.getContent().stream()
            .map(artworkMapper::toDto)
            .collect(Collectors.toList());

        // 构建分页响应
        return new PageResponse<>(
            artworkDTOs,
            page + 1,
            pageSize,
            artworkPage.getTotalElements(),
            artworkPage.getTotalPages(),
            artworkPage.hasPrevious(),
            artworkPage.hasNext()
        );
    }

    /**
     * 获取个性化推荐作品
     * 基于用户的兴趣标签进行智能推荐，提供个性化的内容发现体验
     * 如果用户没有设置兴趣标签，则返回精选推荐作品
     * 
     * @param userId 用户ID
     * @return 推荐作品列表
     * @throws BusinessException 当用户不存在时抛出
     */
    public List<ArtworkDTO> getRecommendations(Long userId) {
        // 查询用户信息
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        // 获取用户的兴趣标签
        List<String> userTags = user.getTagsList();
        if (userTags.isEmpty()) {
            // 如果用户没有设置兴趣标签，返回精选推荐作品
            Page<Artwork> featuredPage = artworkRepository.findByFeaturedAndEnabled(
                true, true, PageRequest.of(0, 12)
            );
            return featuredPage.getContent().stream()
                .map(artworkMapper::toDto)
                .collect(Collectors.toList());
        }

        // 根据用户标签推荐作品
        // 简化实现：取前3个标签进行匹配，提高推荐准确性
        String tag1 = userTags.size() > 0 ? userTags.get(0) : "";
        String tag2 = userTags.size() > 1 ? userTags.get(1) : "";
        String tag3 = userTags.size() > 2 ? userTags.get(2) : "";

        // 根据标签查询推荐作品（最多返回12个）
        Page<Artwork> recommendedPage = artworkRepository.findByTags(
            tag1, tag2, tag3, true, PageRequest.of(0, 12)
        );
        
        return recommendedPage.getContent().stream()
            .map(artworkMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * 获取所有启用的作品分类列表
     * 用于前端动态显示分类筛选选项
     * 
     * @return 所有分类名称列表，按字母顺序排序
     */
    public List<String> getCategories() {
        return artworkRepository.findAllCategories();
    }
}

