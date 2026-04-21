package com.artgallery.entity;

import com.artgallery.util.TagUtils;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.util.List;

/**
 * 可标签实体的基类
 * 提供标签相关的通用功能，避免在多个实体中重复实现
 * 
 * @author Art Gallery Team
 */
@MappedSuperclass
public abstract class BaseTaggableEntity {

    /**
     * 标签字段
     * 以逗号分隔的字符串格式存储
     */
    @Column(length = 500)
    protected String tags;

    /**
     * 获取标签列表
     * 将逗号分隔的标签字符串转换为列表格式
     * 
     * @return 标签列表，如果没有标签则返回空列表
     */
    public List<String> getTagsList() {
        return TagUtils.parseTags(this.tags);
    }

    /**
     * 设置标签列表
     * 将标签列表转换为逗号分隔的字符串格式存储
     * 
     * @param tagList 标签列表，如果为空或null则清空标签
     */
    public void setTagsList(List<String> tagList) {
        this.tags = TagUtils.formatTags(tagList);
    }

    /**
     * 获取原始标签字符串
     * 
     * @return 逗号分隔的标签字符串
     */
    public String getTags() {
        return tags;
    }

    /**
     * 设置原始标签字符串
     * 
     * @param tags 逗号分隔的标签字符串
     */
    public void setTags(String tags) {
        this.tags = tags;
    }
}
