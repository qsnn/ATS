package com.platform.ats.entity.application;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 职位申请实体
 */
@Data
@TableName("job_application")
public class JobApplication {

    @TableId(type = IdType.AUTO)
    private Long applicationId;

    private Long userId;

    private Long jobId;

    private Long resumeId;

    /**
     * 申请状态：1-APPLIED, 2-ACCEPTED, 3-REJECTED, 4-WITHDRAWN
     */
    private Integer status;

    @TableField("apply_time")
    private LocalDateTime applyTime;

    @TableField("update_time")
    private LocalDateTime updateTime;
    
    /**
     * 简历快照（包含所有简历信息）
     */
    private String resumeSnapshot;
    
    /**
     * 删除标记：0-未删 1-已删
     */
    @TableLogic
    @TableField("delete_flag")
    private Integer deleteFlag;
}