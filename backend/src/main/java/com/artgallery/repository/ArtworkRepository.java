package com.artgallery.repository;

import com.artgallery.entity.Artwork;
import com.artgallery.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * 艺术作品数据访问接口
 * 继承JpaRepository提供基本的CRUD操作，并定义了复杂的查询方法
 * 支持按分类、标签、艺术家等多维度查询和统计功能
 * 
 * @author Art Gallery Team
 */
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {

    /**
     * 根据艺术家查找作品列表
     * 用于获取指定艺术家的所有作品，支持分页
     * 
     * @param artist 艺术家用户对象
     * @param pageable 分页参数（包含页码、页大小、排序信息）
     * @return 作品分页列表，按创建时间倒序排列
     */
    @Query("SELECT a FROM Artwork a JOIN FETCH a.artist WHERE a.artist = :artist")
    Page<Artwork> findByArtist(@Param("artist") User artist, Pageable pageable);

    /**
     * 根据分类查找作品列表
     * 用于获取指定分类下的所有作品，支持分页
     * 
     * @param category 作品分类（如：油画、水彩、素描等）
     * @param pageable 分页参数
     * @return 指定分类的作品分页列表
     */
    @Query("SELECT a FROM Artwork a JOIN FETCH a.artist WHERE a.category = :category")
    Page<Artwork> findByCategory(@Param("category") String category, Pageable pageable);

    /**
     * 根据分类和启用状态查找作品列表
     * 用于获取指定分类下且状态为启用的作品，通常用于前台展示
     * 
     * @param category 作品分类
     * @param enabled 是否启用（true=启用，false=禁用）
     * @param pageable 分页参数
     * @return 符合条件的作品分页列表
     */
    @Query("SELECT a FROM Artwork a JOIN FETCH a.artist WHERE a.category = :category AND a.enabled = :enabled")
    Page<Artwork> findByCategoryAndEnabled(@Param("category") String category, @Param("enabled") Boolean enabled, Pageable pageable);

    /**
     * 查找精选作品列表
     * 用于获取推荐到首页的精选作品，支持启用状态筛选
     * 
     * @param featured 是否精选（true=精选作品，false=普通作品）
     * @param enabled 是否启用
     * @param pageable 分页参数
     * @return 精选作品分页列表
     */
    @Query("SELECT a FROM Artwork a JOIN FETCH a.artist WHERE a.featured = :featured AND a.enabled = :enabled")
    Page<Artwork> findByFeaturedAndEnabled(@Param("featured") Boolean featured, @Param("enabled") Boolean enabled, Pageable pageable);

    /**
     * 根据标题搜索作品（模糊查询）
     * 支持在作品标题中进行全文搜索，用于搜索功能
     * 
     * @param keyword 搜索关键词
     * @param pageable 分页参数
     * @return 包含关键词的作品分页列表
     */
    @Query("SELECT a FROM Artwork a JOIN FETCH a.artist WHERE a.title LIKE %:keyword% AND a.enabled = true")
    Page<Artwork> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 根据标签搜索作品
     * 查找标签中包含指定标签的作品，支持模糊匹配
     * 
     * @param tag 标签名称
     * @param enabled 是否启用
     * @param pageable 分页参数
     * @return 包含指定标签的作品分页列表
     */
    @Query("SELECT a FROM Artwork a JOIN FETCH a.artist WHERE a.tags LIKE %:tag% AND a.enabled = :enabled")
    Page<Artwork> findByTag(@Param("tag") String tag, @Param("enabled") Boolean enabled, Pageable pageable);

    /**
     * 根据多个标签查找作品（智能推荐）
     * 支持最多3个标签的匹配，按匹配度排序，用于个性化推荐
     * 匹配度高的作品会排在前面
     * 
     * @param tag1 第一个标签（权重最高）
     * @param tag2 第二个标签
     * @param tag3 第三个标签
     * @param enabled 是否启用
     * @param pageable 分页参数
     * @return 按标签匹配度排序的作品分页列表
     */
    @Query("SELECT a FROM Artwork a JOIN FETCH a.artist WHERE a.enabled = :enabled AND " +
           "(a.tags LIKE %:tag1% OR a.tags LIKE %:tag2% OR a.tags LIKE %:tag3%) " +
           "ORDER BY " +
           "CASE WHEN a.tags LIKE %:tag1% THEN 1 ELSE 0 END + " +
           "CASE WHEN a.tags LIKE %:tag2% THEN 1 ELSE 0 END + " +
           "CASE WHEN a.tags LIKE %:tag3% THEN 1 ELSE 0 END DESC")
    Page<Artwork> findByTags(@Param("tag1") String tag1, 
                            @Param("tag2") String tag2, 
                            @Param("tag3") String tag3,
                            @Param("enabled") Boolean enabled, 
                            Pageable pageable);

    /**
     * 查找启用状态的作品列表
     * 用于获取所有启用或禁用的作品，支持分页
     * 
     * @param enabled 是否启用
     * @param pageable 分页参数
     * @return 指定状态的作品分页列表
     */
    @Query("SELECT a FROM Artwork a JOIN FETCH a.artist WHERE a.enabled = :enabled")
    Page<Artwork> findByEnabled(@Param("enabled") Boolean enabled, Pageable pageable);

    /**
     * 根据ID列表批量查找作品
     * 用于批量操作，如批量删除、批量更新等
     * 
     * @param ids 作品ID列表
     * @return 对应的作品列表
     */
    @Query("SELECT DISTINCT a FROM Artwork a JOIN FETCH a.artist WHERE a.id IN :ids")
    List<Artwork> findByIdIn(@Param("ids") List<Long> ids);

    /**
     * 统计指定状态的作品总数
     * 用于后台统计和数据展示
     * 
     * @param enabled 是否启用
     * @return 符合条件的作品总数
     */
    long countByEnabled(Boolean enabled);

    /**
     * 统计所有作品的总浏览量
     * 用于系统数据统计和分析
     * 
     * @return 总浏览量（可能为null）
     */
    @Query("SELECT SUM(a.viewCount) FROM Artwork a")
    Long sumViewCount();

    /**
     * 统计所有作品的总点赞数
     * 用于系统数据统计和分析
     * 
     * @return 总点赞数（可能为null）
     */
    @Query("SELECT SUM(a.likeCount) FROM Artwork a")
    Long sumLikeCount();

    /**
     * 统计精选且启用的作品数量
     * 用于统计推荐作品的数量
     * 
     * @param featured 是否精选
     * @param enabled 是否启用
     * @return 符合条件的作品数量
     */
    long countByFeaturedAndEnabled(Boolean featured, Boolean enabled);

    /**
     * 按分类统计作品数量
     * 用于生成分类统计图表和数据展示
     * 
     * @return 分类统计结果，每个元素包含[分类名称, 作品数量]
     */
    @Query("SELECT a.category, COUNT(a) FROM Artwork a WHERE a.enabled = true GROUP BY a.category")
    List<Object[]> countByCategory();

    /**
     * 获取所有启用的作品分类列表
     * 用于前端动态显示分类筛选选项
     * 
     * @return 所有分类名称列表，按字母顺序排序
     */
    @Query("SELECT DISTINCT a.category FROM Artwork a WHERE a.enabled = true ORDER BY a.category")
    List<String> findAllCategories();
}

