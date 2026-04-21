package com.artgallery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 评论实体类
 * 定义用户评论的数据结构和多层级关系
 * 支持对作品的直接评论和回复其他评论的子评论
 * 
 * @author Art Gallery Team
 */
@Entity
@Table(name = "comments", indexes = {
    @Index(name = "idx_artwork_id", columnList = "artwork_id"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_parent_id", columnList = "parent_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Comment {

    /**
     * 评论ID，主键，自增
     * 用于唯一标识系统中的每条评论
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 评论用户信息，多对一关系
     * 关联到User实体，表示评论的发布者
     * 使用LAZY加载，避免不必要的用户数据加载
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 在“多”的表里加一个外键字段
    // 在“多的一方”放一个外键，指向“一的一方”

    /**
     * 被评论的艺术作品，多对一关系
     * 关联到Artwork实体，表示评论所属的作品
     * 使用LAZY加载，按需加载作品信息
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_id", nullable = false)
    private Artwork artwork;

    /**
     * 评论内容，不能为空
     * 使用TEXT类型存储，支持长文本评论内容
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * 父评论信息，多对一关系
     * 用于实现回复功能，null表示顶层评论（直接回复作品）
     * 非null表示子评论（回复其他评论）
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;

    /**
     * 子评论列表，一对多关系
     * 存储回复此评论的所有子评论
     * 按创建时间正序排列，最早的回复在前
     */
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("createTime ASC")
    private List<Comment> replies = new ArrayList<>();

    /**
     * 评论创建时间
     * 由JPA审计功能自动填充，不可更新
     */
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createTime;
}
