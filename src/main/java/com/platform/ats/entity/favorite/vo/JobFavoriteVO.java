package com.platform.ats.entity.favorite.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 职位收藏展示对象（带部分职位信息）
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Data
public class JobFavoriteVO {

    /**
     * 收藏ID
     */
    private Long favoriteId;

    /**
     * 职位ID
     */
    private Long jobId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 职位标题
     */
    private String jobTitle;

    /**
     * 公司ID
     */
    private Long companyId;
    
    /**
     * 公司名称
     */
    private String companyName;

    /**
     * 职位所属部门
     */
    private String department;
    
    /**
     * 职位发布状态：0-草稿 1-已发布 2-已下架
     */
    private Integer publishStatus;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}