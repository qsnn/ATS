package com.platform.ats.entity.talentpool.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 人才库视图对象
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Data
public class TalentPoolVO {

    /**
     * 人才ID
     */
    private Long talentId;

    /**
     * 简历ID
     */
    private Long resumeId;

    /**
     * 公司ID
     */
    private Long companyId;

    /**
     * 标签
     */
    private String tag;

    /**
     * 操作人ID
     */
    private Long operatorId;

    /**
     * 录入时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime putInTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;
}