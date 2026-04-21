package com.artgallery.service.impl;

import com.artgallery.dto.CommentCreateRequest;
import com.artgallery.dto.CommentDTO;
import com.artgallery.entity.Artwork;
import com.artgallery.entity.Comment;
import com.artgallery.entity.User;
import com.artgallery.mapper.CommentMapper;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.CommentRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.service.CommentService;
import com.artgallery.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 评论服务实现类
 * 实现评论相关的所有业务逻辑，包括评论的创建、查询、删除等功能
 * 支持多层级评论结构和权限验证
 * 
 * @author Art Gallery Team
 */
@Service
@RequiredArgsConstructor
@SuppressWarnings("nullness")
public class CommentServiceImpl implements CommentService {

    /**
     * 评论数据访问层
     */
    private final CommentRepository commentRepository;
    
    /**
     * 艺术作品数据访问层
     */
    private final ArtworkRepository artworkRepository;
    
    /**
     * 用户数据访问层
     */
    private final UserRepository userRepository;

    /**
     * 评论映射器
     */
    private final CommentMapper commentMapper;

    /**
     * 创建新评论
     * 支持创建顶层评论和回复评论，包含完整的业务验证逻辑
     * 
     * @param artworkId 作品ID
     * @param userId 用户ID
     * @param request 评论创建请求
     * @return 创建成功的评论DTO
     * @throws BusinessException 当作品或用户不存在时抛出
     */
    @Override
    @Transactional
    public CommentDTO createComment(Long artworkId, Long userId, CommentCreateRequest request) {
        // 验证作品是否存在
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new BusinessException("ARTWORK_NOT_FOUND", "作品不存在"));
        
        // 验证用户是否存在
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        
        // 创建新的评论实体
        Comment comment = new Comment();
        comment.setUser(user);
        comment.setArtwork(artwork);
        comment.setContent(request.getContent());
        
        // 如果是回复评论，验证父评论是否存在并建立关联
        if (request.getParentId() != null) {
            Comment parentComment = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "父评论不存在"));
            comment.setParent(parentComment);
        }
        
        // 保存评论到数据库
        comment = commentRepository.save(comment);
        
        // 转换为DTO并返回
        return commentMapper.toDto(comment);
    }

    /**
     * 获取作品的所有顶层评论
     * 顶层评论指直接回复作品的评论，不包含回复其他评论的子评论
     * 
     * @param artworkId 作品ID
     * @return 顶层评论列表
     * @throws BusinessException 当作品不存在时抛出
     */
    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getTopLevelCommentsByArtworkId(Long artworkId) {
        // 验证作品是否存在
        artworkRepository.findById(artworkId)
                .orElseThrow(() -> new BusinessException("ARTWORK_NOT_FOUND", "作品不存在"));
        
        // 查询顶层评论（没有父评论的评论）
        List<Comment> comments = commentRepository.findTopLevelCommentsByArtworkId(artworkId);
        
        // 转换为DTO列表
        return comments.stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * 获取指定评论的所有子评论（回复）
     * 子评论指回复其他评论的评论，形成多层级评论结构
     * 
     * @param commentId 父评论ID
     * @return 子评论列表
     * @throws BusinessException 当父评论不存在时抛出
     */
    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getRepliesByCommentId(Long commentId) {
        // 验证父评论是否存在
        commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));
        
        // 查询所有子评论
        List<Comment> replies = commentRepository.findByParentId(commentId);
        
        // 转换为DTO列表
        return replies.stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * 删除评论
     * 只有评论的作者才能删除自己的评论，确保数据安全
     * 
     * @param commentId 要删除的评论ID
     * @param userId 当前操作用户的ID
     * @throws BusinessException 当评论不存在或无权限时抛出
     */
    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        // 查询要删除的评论
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));
        
        // 验证权限：只有评论作者才能删除评论
        if (!comment.getUser().getId().equals(userId)) {
            throw new BusinessException("PERMISSION_DENIED", "无权删除此评论");
        }
        
        // 执行删除操作
        commentRepository.delete(comment);
    }

    /**
     * 获取作品的总评论数量
     * 统计指定作品的所有评论数量，包括顶层评论和子评论
     * 
     * @param artworkId 作品ID
     * @return 评论总数量
     * @throws BusinessException 当作品不存在时抛出
     */
    @Override
    @Transactional(readOnly = true)
    public Long getCommentCountByArtworkId(Long artworkId) {
        // 验证作品是否存在
        artworkRepository.findById(artworkId)
                .orElseThrow(() -> new BusinessException("ARTWORK_NOT_FOUND", "作品不存在"));
        
        // 查询评论总数
        return commentRepository.countByArtworkId(artworkId);
    }
    
}
