package com.artgallery.service.impl;

import com.artgallery.entity.Artwork;
import com.artgallery.entity.Like;
import com.artgallery.entity.User;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.LikeRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.LikeService;
import com.artgallery.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 点赞服务实现类
 * 实现用户对艺术作品点赞相关的所有业务逻辑
 * 包含点赞、取消点赞、状态查询和统计功能，确保数据一致性
 * 
 * @author Art Gallery Team
 */
@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    /**
     * 点赞数据访问层
     */
    private final LikeRepository likeRepository;
    
    /**
     * 艺术作品数据访问层
     */
    private final ArtworkRepository artworkRepository;
    
    /**
     * 用户数据访问层
     */
    private final UserRepository userRepository;

    /**
     * 用户点赞艺术作品
     * 防止重复点赞，自动更新作品点赞计数
     * 
     * @param artworkId 作品ID
     * @param userId 用户ID
     * @return 点赞后的作品总点赞数量
     * @throws BusinessException 当作品或用户不存在时抛出
     */
    @Override
    @Transactional
    public Integer likeArtwork(Long artworkId, Long userId) {
        // 验证作品是否存在
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new BusinessException("ARTWORK_NOT_FOUND", "作品不存在"));
        
        // 验证用户是否存在
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        
        // 检查用户是否已经点赞过该作品
        if (likeRepository.findByUserIdAndArtworkId(userId, artworkId).isPresent()) {
            return artwork.getLikeCount(); // 已点赞，直接返回当前点赞数
        }
        
        // 创建新的点赞记录
        Like like = new Like();
        like.setUser(user);
        like.setArtwork(artwork);
        likeRepository.save(like);
        
        // 更新作品的点赞计数
        Integer newLikeCount = artwork.getLikeCount() + 1;
        artwork.setLikeCount(newLikeCount);
        artworkRepository.save(artwork);
        
        return newLikeCount;
    }

    /**
     * 用户取消点赞艺术作品
     * 只有已点赞的用户才能取消点赞，自动更新作品点赞计数
     * 
     * @param artworkId 作品ID
     * @param userId 用户ID
     * @return 取消点赞后的作品总点赞数量
     * @throws BusinessException 当作品不存在时抛出
     */
    @Override
    @Transactional
    public Integer unlikeArtwork(Long artworkId, Long userId) {
        // 验证作品是否存在
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new BusinessException("ARTWORK_NOT_FOUND", "作品不存在"));
        
        // 检查用户是否已经点赞过该作品
        if (likeRepository.findByUserIdAndArtworkId(userId, artworkId).isEmpty()) {
            return artwork.getLikeCount(); // 未点赞，直接返回当前点赞数
        }
        
        // 删除点赞记录
        likeRepository.deleteByUserIdAndArtworkId(userId, artworkId);
        
        // 更新作品的点赞计数，确保不会出现负数
        Integer newLikeCount = Math.max(0, artwork.getLikeCount() - 1);
        artwork.setLikeCount(newLikeCount);
        artworkRepository.save(artwork);
        
        return newLikeCount;
    }

    /**
     * 检查用户是否已经点赞指定作品
     * 用于前端显示点赞状态，如按钮的高亮状态
     * 
     * @param artworkId 作品ID
     * @param userId 用户ID
     * @return true如果用户已点赞该作品，false如果未点赞
     */
    @Override
    public boolean isLikedByUser(Long artworkId, Long userId) {
        return likeRepository.findByUserIdAndArtworkId(userId, artworkId).isPresent();
    }

    /**
     * 获取艺术作品的总点赞数量
     * 通过统计点赞记录表获得准确的点赞数量
     * 
     * @param artworkId 作品ID
     * @return 作品的总点赞数量
     */
    @Override
    public Integer getLikeCount(Long artworkId) {
        Long count = likeRepository.countByArtworkId(artworkId);
        return count.intValue();
    }
}
