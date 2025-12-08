package com.platform.ats.entity.favorite.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 职位收藏展示对象（带部分职位信息）
 */
@Data
public class JobFavoriteVO {

    private Long favoriteId;

    private Long jobId;

    private Long userId;

    private String jobTitle;

    private Long companyId;
    
    private String companyName;

    /**
     * 职位所属部门
     */
    private String department;
    
    /**
     * 职位发布状态：0-草稿 1-已发布 2-已下架
     */
    private Integer publishStatus;

    private LocalDateTime createTime;
}