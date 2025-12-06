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

    private LocalDateTime createTime;
}

