package com.artgallery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 点赞实体类
 * 定义用户对艺术作品点赞的数据结构
 * 通过唯一约束确保每个用户对每件作品只能点赞一次
 * 
 * @author Art Gallery Team
 */
@Entity
@Table(name = "likes", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_artwork", columnNames = {"user_id", "artwork_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Like {

    /**
     * 点赞记录ID，主键，自增
     * 用于唯一标识系统中的每条点赞记录
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 点赞用户信息，多对一关系
     * 关联到User实体，表示执行点赞操作的用户
     * 使用LAZY加载，避免不必要的用户数据加载
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * 被点赞的艺术作品，多对一关系
     * 关联到Artwork实体，表示被点赞的作品
     * 使用LAZY加载，按需加载作品信息
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_id", nullable = false)
    private Artwork artwork;

    /**
     * 点赞创建时间
     * 由JPA审计功能自动填充，不可更新
     * 用于记录点赞操作的时间戳
     */
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createTime;
}
