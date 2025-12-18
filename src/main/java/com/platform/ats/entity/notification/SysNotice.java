package com.platform.ats.entity.notification;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.io.Serial;

/**
 * 系统通知表实体类
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-16
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_notice")
public class SysNotice implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 通知ID
     */
    @TableId(value = "notice_id", type = IdType.AUTO)
    private Long noticeId;

    /**
     * 接收用户ID（关联sys_user.user_id）
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 通知类型（如：简历投递成功、面试通知）
     */
    @TableField("notice_type")
    private String noticeType;

    /**
     * 通知内容
     */
    @TableField("notice_content")
    private String noticeContent;

    /**
     * 发送时间
     */
    @TableField(value = "send_time", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime sendTime;

    /**
     * 阅读状态：0-未读 1-已读
     */
    @TableField("read_status")
    private Integer readStatus;

    /**
     * 发送状态：0-未发 1-已发
     */
    @TableField("send_status")
    private Integer sendStatus;

    /**
     * 删除标记：0-未删 1-已删
     */
    @TableLogic
    @TableField("delete_flag")
    private Integer deleteFlag;
}