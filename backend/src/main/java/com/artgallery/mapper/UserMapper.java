package com.artgallery.mapper;

import com.artgallery.dto.UserDTO;
import com.artgallery.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * User实体与DTO之间的映射器
 * 使用MapStruct自动生成映射代码
 * 
 * @author Art Gallery Team
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    
    /**
     * 将User实体转换为UserDTO
     * 
     * @param user 用户实体
     * @return UserDTO对象
     */
    @Mapping(source = "tagsList", target = "tags")
    UserDTO toDto(User user);
}
