package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.platform.ats.entity.notification.SysNotice;

import java.util.List;

/**
 * 系统通知服务接口
 */
public interface SysNoticeService extends IService<SysNotice> {

    /**
     * 创建通知
     */
    Long createNotice(SysNotice sysNotice);

    /**
     * 根据ID获取通知
     */
    SysNotice getNoticeById(Long noticeId);

    /**
     * 根据用户ID获取通知列表
     */
    List<SysNotice> getNoticesByUserId(Long userId);

    /**
     * 根据用户ID和阅读状态获取通知列表
     */
    List<SysNotice> getNoticesByUserIdAndReadStatus(Long userId, Integer readStatus);

    /**
     * 根据用户ID分页获取通知列表
     */
    IPage<SysNotice> getNoticePageByUserId(Long userId, Integer pageNum, Integer pageSize);

    /**
     * 根据用户ID和通知类型获取通知列表
     */
    List<SysNotice> getNoticesByUserIdAndType(Long userId, String noticeType);

    /**
     * 更新通知
     */
    Boolean updateNotice(SysNotice sysNotice);

    /**
     * 更新通知阅读状态
     */
    Boolean updateReadStatus(Long noticeId, Integer readStatus);

    /**
     * 批量更新通知阅读状态
     */
    Boolean batchUpdateReadStatus(List<Long> noticeIds, Integer readStatus);

    /**
     * 更新通知发送状态
     */
    Boolean updateSendStatus(Long noticeId, Integer sendStatus);

    /**
     * 批量更新通知发送状态
     */
    Boolean batchUpdateSendStatus(List<Long> noticeIds, Integer sendStatus);

    /**
     * 删除通知（逻辑删除）
     */
    Boolean deleteNotice(Long noticeId);

    /**
     * 获取用户未读通知数量
     */
    Integer getUnreadNoticeCount(Long userId);
}