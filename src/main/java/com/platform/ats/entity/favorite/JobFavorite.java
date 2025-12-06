package com.platform.ats.entity.favorite;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 职位收藏实体
 */
@Data
@TableName("job_favorite")
public class JobFavorite {

    @TableId(type = IdType.AUTO)
    private Long favoriteId;

    private Long userId;

    private Long jobId;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    /**
     * 删除标记：0-未删 1-已删
     */
    private Integer deleteFlag;
}

