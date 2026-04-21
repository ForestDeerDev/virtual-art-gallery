package com.artgallery.mapper;

import com.artgallery.dto.CommentDTO;
import com.artgallery.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

/**
 * Comment实体与DTO之间的映射器
 * 使用MapStruct自动生成映射代码
 * 
 * @author Art Gallery Team
 */
@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface CommentMapper {
    
    /**
     * 将Comment实体转换为CommentDTO
     * 
     * @param comment 评论实体
     * @return CommentDTO对象
     */
    @Mapping(source = "parent.id", target = "parentId")
    @Mapping(source = "replies", target = "replyCount", qualifiedByName = "calculateReplyCount")
    CommentDTO toDto(Comment comment);
    
    /**
     * 将Comment实体列表转换为CommentDTO列表
     * 
     * @param comments 评论实体列表
     * @return CommentDTO对象列表
     */
    List<CommentDTO> toDtoList(List<Comment> comments);
    
    /**
     * 计算回复数量
     * 
     * @param replies 回复列表
     * @return 回复数量
     */
    @Named("calculateReplyCount")
    default Integer calculateReplyCount(List<?> replies) {
        return replies != null ? replies.size() : 0;
    }
}
