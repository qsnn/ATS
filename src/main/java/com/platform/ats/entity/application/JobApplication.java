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
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-13
 */
@Data
@TableName("job_application")
public class JobApplication {

    /**
     * 申请ID，主键自增
     */
    @TableId(type = IdType.AUTO)
    private Long applicationId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 职位ID
     */
    private Long jobId;

    /**
     * 简历ID
     */
    private Long resumeId;

    /**
     * 申请状态：1-APPLIED(已申请), 2-ACCEPTED(已接受), 3-REJECTED(已拒绝), 4-WITHDRAWN(已撤销)
     */
    private Integer status;

    /**
     * 申请时间
     */
    @TableField("apply_time")
    private LocalDateTime applyTime;

    /**
     * 更新时间
     */
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