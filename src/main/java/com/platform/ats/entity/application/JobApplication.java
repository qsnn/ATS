package com.platform.ats.entity.application;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
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
     * 申请状态：APPLIED/ACCEPTED/REJECTED/WITHDRAWN
     */
    private String status;

    private LocalDateTime applyTime;

    private LocalDateTime updateTime;
    
    /**
     * 简历快照（包含所有简历信息）
     */
    private String resumeSnapshot;
}