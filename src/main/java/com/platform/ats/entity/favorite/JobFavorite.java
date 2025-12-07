package com.platform.ats.entity.favorite;

import com.baomidou.mybatisplus.annotation.*;
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

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 删除标记：0-未删 1-已删
     */
    @TableLogic
    @TableField("delete_flag")
    private Integer deleteFlag;
}