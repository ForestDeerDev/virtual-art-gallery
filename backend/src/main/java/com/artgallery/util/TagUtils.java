package com.artgallery.util;

import java.util.ArrayList;
import java.util.List;

/**
 * 标签工具类
 * 提供标签字符串与列表之间的转换功能
 * 
 * @author Art Gallery Team
 */
public class TagUtils {
    
    /**
     * 将逗号分隔的标签字符串转换为列表
     * 
     * @param tags 逗号分隔的标签字符串
     * @return 标签列表，如果没有标签则返回空列表
     */
    public static List<String> parseTags(String tags) {
        if (tags == null || tags.trim().isEmpty()) {
            return new ArrayList<>();
        }
        List<String> tagList = new ArrayList<>();
        String[] tagArray = tags.split(",");
        for (String tag : tagArray) {
            String trimmedTag = tag.trim();
            if (!trimmedTag.isEmpty()) {
                tagList.add(trimmedTag);
            }
        }
        return tagList;
    }
    
    /**
     * 将标签列表转换为逗号分隔的字符串
     * 
     * @param tagList 标签列表
     * @return 逗号分隔的字符串，如果列表为空或null则返回null
     */
    public static String formatTags(List<String> tagList) {
        if (tagList == null || tagList.isEmpty()) {
            return null;
        }
        return String.join(",", tagList);
    }
}
