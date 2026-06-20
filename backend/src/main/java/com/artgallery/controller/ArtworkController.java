package com.artgallery.controller;

import com.artgallery.dto.*;
import com.artgallery.security.SecurityUtils;
import com.artgallery.service.ArtworkService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 艺术作品控制器
 * 处理艺术作品相关的RESTful API请求
 * 
 * @author Art Gallery Team
 */
@RestController
@RequestMapping("/artworks")
public class ArtworkController {

    private final ArtworkService artworkService;

    public ArtworkController(ArtworkService artworkService) {
        this.artworkService = artworkService;
    }

    /**
     * 获取艺术作品列表（分页）
     * 
     * GET /api/artworks?page=0&pageSize=12&category=油画&sortBy=latest&tags=抽象
     * 
     * @param page 页码（从0开始）
     * @param pageSize 每页大小
     * @param category 分类
     * @param sortBy 排序方式
     * @param tags 标签
     * @return 分页响应
     */
    @GetMapping
    public ResponseEntity<PageResponse<ArtworkDTO>> getArtworks(
            @RequestParam(name = "page", required = false) Integer page,
            @RequestParam(name = "pageSize", required = false) Integer pageSize,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "sortBy", required = false) String sortBy,
            @RequestParam(name = "tags", required = false) String tags,
            @RequestParam(name = "featured", required = false) Boolean featured) {
        
        PageResponse<ArtworkDTO> response = artworkService.getArtworks(
            page, pageSize, category, sortBy, tags, featured
        );
        return ResponseEntity.ok(response);
    }

    /**
     * 获取艺术作品详情
     * 
     * GET /api/artworks/{id}
     * 
     * @param id 作品ID
     * @return 作品详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<ArtworkDTO> getArtworkById(@PathVariable("id") Long id) {
        ArtworkDTO artwork = artworkService.getArtworkById(id);
        return ResponseEntity.ok(artwork);
    }

    /**
     * 创建艺术作品
     * 
     * POST /api/artworks
     * 
     * @param request 创建请求
     * @param httpRequest HTTP请求
     * @return 创建的作品
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ArtworkDTO> createArtwork(@Valid @RequestBody ArtworkCreateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        ArtworkDTO artwork = artworkService.createArtwork(request, userId);
        return ResponseEntity.ok(artwork);
    }

    /**
     * 更新艺术作品
     * 
     * PUT /api/artworks/{id}
     * 
     * @param id 作品ID
     * @param request 更新请求
     * @param httpRequest HTTP请求
     * @return 更新后的作品
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ArtworkDTO> updateArtwork(
            @PathVariable("id") Long id,
            @RequestBody ArtworkUpdateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        ArtworkDTO artwork = artworkService.updateArtwork(id, request, userId);
        return ResponseEntity.ok(artwork);
    }

    /**
     * 删除艺术作品
     * 
     * DELETE /api/artworks/{id}
     * 
     * @param id 作品ID
     * @param httpRequest HTTP请求
     * @return 成功响应
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> deleteArtwork(@PathVariable("id") Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        artworkService.deleteArtwork(id, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 批量删除艺术作品
     * 
     * DELETE /api/artworks/batch
     * 
     * @param request 包含ids列表的请求
     * @param httpRequest HTTP请求
     * @return 成功响应
     */
    @DeleteMapping("/batch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> batchDeleteArtworks(@RequestBody BatchDeleteRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        artworkService.batchDeleteArtworks(request.getIds(), userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 批量更新艺术作品
     * 
     * PUT /api/artworks/batch
     * 
     * @param request 批量更新请求
     * @param httpRequest HTTP请求
     * @return 成功响应
     */
    @PutMapping("/batch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> batchUpdateArtworks(@RequestBody BatchUpdateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        artworkService.batchUpdateArtworks(request.getUpdates(), userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 搜索艺术作品
     * 
     * GET /api/artworks/search?keyword=抽象
     * 
     * @param keyword 关键词
     * @param page 页码
     * @param pageSize 每页大小
     * @return 搜索结果
     */
    @GetMapping("/search")
    public ResponseEntity<PageResponse<ArtworkDTO>> searchArtworks(
            @RequestParam(name = "keyword") String keyword,
            @RequestParam(name = "page", required = false) Integer page,
            @RequestParam(name = "pageSize", required = false) Integer pageSize) {
        
        PageResponse<ArtworkDTO> response = artworkService.searchArtworks(keyword, page, pageSize);
        return ResponseEntity.ok(response);
    }

    /**
     * 获取推荐作品
     * 
     * GET /api/artworks/recommendations
     * 
     * @param httpRequest HTTP请求
     * @return 推荐作品列表
     */
    @GetMapping("/recommendations")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ArtworkDTO>> getRecommendations() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<ArtworkDTO> recommendations = artworkService.getRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * 获取所有作品分类
     * 
     * GET /api/artworks/categories
     * 
     * @return 分类列表
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = artworkService.getCategories();
        return ResponseEntity.ok(categories);
    }


}

