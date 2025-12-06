package com.platform.ats.entity.favorite.dto;

import lombok.Data;

/**
 * 新增职位收藏请求
 */
@Data
public class JobFavoriteCreateDTO {

    private Long userId;

    private Long jobId;
}

