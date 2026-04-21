package com.artgallery.service;

import com.artgallery.dto.StatsDTO;

/**
 * 管理员服务接口
 * 定义管理员专用的系统统计和管理功能
 * 
 * @author Art Gallery Team
 */
public interface AdminService {

    /**
     * 获取系统综合统计信息
     * 包括用户数、作品数、浏览量、点赞量等多维度数据
     * 
     * @return 统计信息DTO，包含所有系统统计数据
     */
    StatsDTO getStats();
}
