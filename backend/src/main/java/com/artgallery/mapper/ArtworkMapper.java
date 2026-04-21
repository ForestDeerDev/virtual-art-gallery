package com.artgallery.mapper;

import com.artgallery.dto.ArtworkDTO;
import com.artgallery.entity.Artwork;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Artwork实体与DTO之间的映射器
 * 使用MapStruct自动生成映射代码
 * 
 * @author Art Gallery Team
 */
@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface ArtworkMapper {
    
    /**
     * 将Artwork实体转换为ArtworkDTO
     * 
     * @param artwork 艺术作品实体
     * @return ArtworkDTO对象
     */
    @Mapping(source = "artist.username", target = "artist")
    @Mapping(source = "artist.id", target = "artistId")
    @Mapping(source = "tagsList", target = "tags")
    ArtworkDTO toDto(Artwork artwork);
}
