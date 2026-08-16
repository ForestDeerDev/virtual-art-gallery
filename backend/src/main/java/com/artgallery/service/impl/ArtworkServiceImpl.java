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
import com.artgallery.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;
import java.util.ArrayList;

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

    private static final Logger logger = LoggerFactory.getLogger(ArtworkServiceImpl.class);

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

    private final FileStorageService fileStorageService;

    /**
     * 用于动态 JPQL 查询（keyword + category + tags 多条件 AND 叠加）
     */
    private final jakarta.persistence.EntityManager entityManager;

    public ArtworkServiceImpl(ArtworkRepository artworkRepository, UserRepository userRepository, ArtworkMapper artworkMapper, FileStorageService fileStorageService, jakarta.persistence.EntityManager entityManager) {
        this.artworkRepository = artworkRepository;
        this.userRepository = userRepository;
        this.artworkMapper = artworkMapper;
        this.fileStorageService = fileStorageService;
        this.entityManager = entityManager;
    }

    /**
     * 获取艺术作品列表（分页查询）
     * 支持多种筛选条件 AND 叠加：keyword（搜索）+ category + tags + featured 可同时生效，
     * 并通过 sortBy 控制排序，为前端提供统一的查询入口。
     * 
     * @param page 页码（从0开始）
     * @param pageSize 每页大小
     * @param category 分类筛选（可选）
     * @param sortBy 排序方式：latest（最新）、popular（最受欢迎）、title（标题）
     * @param tags 标签筛选（可选）
     * @param featured 是否推荐作品筛选（可选）
     * @param keyword 搜索关键词（可选，标题模糊匹配）
     * @return 分页响应，包含作品列表和分页信息
     */
    @Override
    public PageResponse<ArtworkDTO> getArtworks(Integer page, Integer pageSize, 
                                                String category, String sortBy, String tags, Boolean featured,
                                                String keyword) {
        if (page == null || page < 0) page = 0;
        if (pageSize == null || pageSize <= 0) pageSize = 12;

        // ---------- 构建排序子句（白名单校验，防注入） ----------
        // key = 前端 sortBy 值，value = JPQL 排序字段 + 方向
        // 仅允许预定义的 3 种排序，避免拼接用户输入导致字段注入
        Map<String, String> sortMap = Map.of(
            "latest",   "a.createTime DESC",
            "popular",  "a.viewCount DESC, a.likeCount DESC",
            "title",    "a.title ASC"
        );
        // 注意：Map.of() 返回的不可变 Map 不允许 null key，
        String orderByClause = (sortBy == null)
            ? "a.createTime DESC"
            : sortMap.getOrDefault(sortBy, "a.createTime DESC");

        // ---------- 动态 JPQL：所有条件 AND 叠加 ----------
        StringBuilder jpql = new StringBuilder(
            "SELECT a FROM Artwork a JOIN FETCH a.artist WHERE a.enabled = true"
        );
        StringBuilder countJpql = new StringBuilder(
            "SELECT COUNT(a) FROM Artwork a WHERE a.enabled = true"
        );
        List<Object> params = new ArrayList<>();
        int idx = 1;

        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            jpql.append(" AND a.title LIKE ?").append(idx);
            countJpql.append(" AND a.title LIKE ?").append(idx);
            params.add("%" + kw + "%");
            idx++;
        }
        if (category != null && !category.trim().isEmpty()) {
            String c = category.trim();
            jpql.append(" AND a.category = ?").append(idx);
            countJpql.append(" AND a.category = ?").append(idx);
            params.add(c);
            idx++;
        }
        if (tags != null && !tags.trim().isEmpty()) {
            String t = tags.trim();
            jpql.append(" AND FUNCTION('FIND_IN_SET', ?").append(idx).append(", a.tags) > 0");
            countJpql.append(" AND FUNCTION('FIND_IN_SET', ?").append(idx).append(", a.tags) > 0");
            params.add(t);
            idx++;
        }
        if (featured != null) {
            jpql.append(" AND a.featured = ?").append(idx);
            countJpql.append(" AND a.featured = ?").append(idx);
            params.add(featured);
            idx++;
        }

        // ---------- COUNT 查询（不含 ORDER BY，不含 FETCH） ----------
        jakarta.persistence.Query countQuery = entityManager.createQuery(countJpql.toString());
        for (int i = 0; i < params.size(); i++) {
            countQuery.setParameter(i + 1, params.get(i));
        }
        long total = ((Number) countQuery.getSingleResult()).longValue();

        // ---------- 主查询：一次构造，含排序 + 分页 ----------
        String finalJpql = jpql + " ORDER BY " + orderByClause;
        jakarta.persistence.Query dataQuery = entityManager.createQuery(finalJpql);
        for (int i = 0; i < params.size(); i++) {
            dataQuery.setParameter(i + 1, params.get(i));
        }
        dataQuery.setFirstResult(page * pageSize);
        dataQuery.setMaxResults(pageSize);

        @SuppressWarnings("unchecked")
        List<Artwork> resultList = dataQuery.getResultList();

        int totalPages = (int) Math.ceil((double) total / pageSize);
        if (totalPages < 1) totalPages = 1;

        List<ArtworkDTO> artworkDTOs = resultList.stream()
            .map(artworkMapper::toDto)
            .collect(Collectors.toList());

        return new PageResponse<>(
            artworkDTOs,
            page + 1,
            pageSize,
            total,
            totalPages,
            page > 0,
            page + 1 < totalPages
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
    @Override
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
    @Override
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
    @Override
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
    @Override
    public void deleteArtwork(Long id, Long userId) {
        // 查询要删除的作品
        Artwork artwork = artworkRepository.findById(id)
            .orElseThrow(() -> new BusinessException("ARTWORK_NOT_FOUND", "作品不存在"));

        // 验证权限
        verifyArtworkPermission(artwork, userId, "删除");

        // 先保存文件URL（在删除前获取）
        String imageUrl = artwork.getImageUrl();

        // 先删除数据库记录
        artworkRepository.delete(artwork);

        // 文件删除放在事务外执行，避免影响数据库操作
        deleteArtworkFileSafe(imageUrl);
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
    @Override
    public void batchDeleteArtworks(List<Long> ids, Long userId) {
        // 批量查询要删除的作品
        List<Artwork> artworks = artworkRepository.findByIdIn(ids);
        
        // 先收集所有要删除的文件URL
        List<String> imageUrls = artworks.stream()
            .peek(artwork -> verifyArtworkPermission(artwork, userId, "删除作品：" + artwork.getTitle()))
            .map(Artwork::getImageUrl)
            .filter(url -> url != null && !url.isEmpty())
            .toList();

        // 先删除数据库记录
        artworkRepository.deleteAll(artworks);

        // 文件删除放在事务外执行，避免影响数据库操作
        for (String imageUrl : imageUrls) {
            deleteArtworkFileSafe(imageUrl);
        }
    }

    /**
     * 安全删除艺术作品图片文件（事务外执行）
     * 捕获异常不影响主流程，记录日志便于后续清理
     *
     * @param imageUrl 图片URL
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteArtworkFileSafe(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }
        try {
            fileStorageService.deleteFile(imageUrl);
        } catch (Exception e) {
            logger.warn("删除文件失败，URL: {}, 错误: {}", imageUrl, e.getMessage());
            // 文件删除失败不影响数据库删除，记录日志便于后续人工清理
        }
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
     * 对每个作品都进行权限验证和更新
     * 
     * @param updates 更新列表，每个元素包含作品ID和要更新的字段
     * @param userId 当前用户ID
     * @throws BusinessException 当作品不存在或无权限时抛出
     */
    @Override
    public void batchUpdateArtworks(List<BatchUpdateItem> updates, Long userId) {
        // 批量更新列表不能为空
        if (updates == null || updates.isEmpty()) {
            throw new BusinessException("BATCH_UPDATE_EMPTY", "批量更新列表不能为空");
        }

        for (BatchUpdateItem update : updates) {
            // 参数校验：更新项本身不能为空
            if (update == null) {
                throw new BusinessException("BATCH_UPDATE_INVALID", "批量更新项不能为空");
            }

            // 参数校验：id 和 data 都不能为空
            if (update.getId() == null) {
                throw new BusinessException("BATCH_UPDATE_INVALID", "批量更新项缺少作品ID");
            }
            if (update.getData() == null) {
                throw new BusinessException("BATCH_UPDATE_INVALID", "批量更新项缺少更新数据");
            }

            updateArtwork(update.getId(), update.getData(), userId);
        }
    }

    /**
     * 搜索艺术作品（兼容旧接口：/artworks/search）
     * 内部复用 getArtworks 以保证搜索逻辑一致（默认按最新排序）。
     * 
     * @param keyword 搜索关键词
     * @param page 页码（从0开始）
     * @param pageSize 每页大小
     * @return 分页响应，包含匹配的作品列表
     */
    @Override
    public PageResponse<ArtworkDTO> searchArtworks(String keyword, Integer page, Integer pageSize) {
        return getArtworks(page, pageSize, null, "latest", null, null, keyword);
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
    @Override
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
    @Override
    public List<String> getCategories() {
        return artworkRepository.findAllCategories();
    }

    /**
     * 获取所有分类的作品数量统计
     * 用于前端显示每个分类的作品数量
     * 
     * @return 分类统计列表，每个元素包含分类名称和作品数量
     */
    @Override
    public List<CategoryStatsDTO> getCategoryStats() {
        List<Object[]> results = artworkRepository.countByCategory();
        List<CategoryStatsDTO> stats = new ArrayList<>();
        
        for (Object[] result : results) {
            String category = result[0] != null ? result[0].toString() : null;
            Long count = result[1] != null ? ((Number) result[1]).longValue() : 0L;
            stats.add(new CategoryStatsDTO(category, count));
        }
        
        return stats;
    }
}

