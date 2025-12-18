package com.platform.ats.entity.favorite;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 职位收藏实体
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Data
@TableName("job_favorite")
public class JobFavorite {

    /**
     * 收藏ID，主键自增
     */
    @TableId(type = IdType.AUTO)
    private Long favoriteId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 职位ID
     */
    private Long jobId;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 删除标记：0-未删 1-已删
     */
    @TableLogic
    @TableField("delete_flag")
    private Integer deleteFlag;
}