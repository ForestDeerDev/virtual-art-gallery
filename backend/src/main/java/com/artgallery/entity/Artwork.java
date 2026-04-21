package com.artgallery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 艺术作品实体类
 * 定义艺术作品的数据结构和业务属性
 * 包含作品的基本信息、创作信息、统计数据等
 * 
 * @author Art Gallery Team
 */
@Entity
@Table(name = "artworks", indexes = {
    @Index(name = "idx_title", columnList = "title"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_artist_id", columnList = "artist_id"),
    @Index(name = "idx_create_time", columnList = "create_time")
})
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Artwork extends BaseTaggableEntity {

    /**
     * 作品ID，主键，自增
     * 用于唯一标识系统中的每件艺术作品
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 作品标题，不能为空
     * 用于作品展示和搜索，最大长度200字符
     */
    @Column(nullable = false, length = 200)
    private String title;

    /**
     * 艺术家信息，多对一关系
     * 关联到User实体，表示作品的创作者
     * 使用LAZY加载，避免N+1查询问题
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id", nullable = false)
    private User artist;

    /**
     * 作品分类，不能为空
     * 如：油画、水彩、素描、雕塑、摄影、数字艺术等
     * 用于分类展示和筛选
     */
    @Column(nullable = false, length = 50)
    private String category;

    /**
     * 作品详细描述
     * 使用TEXT类型存储，支持长文本内容
     * 用于介绍作品的创作理念、技法特点等
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * 作品图片URL
     * 存储作品的主要图片链接，用于作品展示
     */
    @Column(length = 500)
    private String imageUrl;

    /**
     * 作品视频URL（可选）
     * 用于展示作品的创作过程或动态效果
     */
    @Column(length = 500)
    private String videoUrl;


    /**
     * 作品尺寸信息
     * 如："100cm × 80cm"、"高50cm"等
     */
    @Column(length = 100)
    private String dimensions;

    /**
     * 作品材质信息
     * 如："布面油画"、"水彩纸"、"青铜"等
     */
    @Column(length = 100)
    private String material;

    /**
     * 作品实际创作时间
     * 区别于系统记录时间，指艺术家的创作时间
     */
    @Column
    private LocalDateTime artworkCreateTime;

    /**
     * 作品浏览量统计
     * 记录作品被查看的次数，默认值为0
     */
    @Column(nullable = false)
    private Integer viewCount = 0;

    /**
     * 作品点赞数统计
     * 记录作品获得的点赞数量，默认值为0
     */
    @Column(nullable = false)
    private Integer likeCount = 0;

    /**
     * 是否精选作品
     * true：精选作品，会在首页推荐
     * false：普通作品
     */
    @Column(nullable = false)
    private Boolean featured = false;

    /**
     * 作品启用状态
     * true：启用，在前台可见
     * false：禁用，仅作者和管理员可见
     */
    @Column(nullable = false)
    private Boolean enabled = true;

    /**
     * 系统记录创建时间
     * 由JPA审计功能自动填充，不可更新
     */
    @CreatedDate
    @Column(nullable = false, updatable = false, name = "create_time")
    private LocalDateTime createTime;

    /**
     * 系统记录最后更新时间
     * 由JPA审计功能自动填充，每次更新时自动更新
     */
    @LastModifiedDate
    @Column(nullable = false, name = "update_time")
    private LocalDateTime updateTime;

}

