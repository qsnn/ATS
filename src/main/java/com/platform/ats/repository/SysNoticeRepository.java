package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.notification.SysNotice;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 系统通知 Mapper 接口
 *
 * @author Administrator
 * @since 2025-12-16
 */
public interface SysNoticeRepository extends BaseMapper<SysNotice> {

    /**
     * 根据用户ID查询通知列表
     *
     * @param userId 用户ID
     * @return 通知列表
     */
    List<SysNotice> selectByUserId(@Param("userId") Long userId);

    /**
     * 根据用户ID和阅读状态查询通知列表
     *
     * @param userId     用户ID
     * @param readStatus 阅读状态
     * @return 通知列表
     */
    List<SysNotice> selectByUserIdAndReadStatus(@Param("userId") Long userId, @Param("readStatus") Integer readStatus);

    /**
     * 根据用户ID分页查询通知列表
     *
     * @param page   分页对象
     * @param userId 用户ID
     * @return 通知分页列表
     */
    IPage<SysNotice> selectPageByUserId(Page<SysNotice> page, @Param("userId") Long userId);

    /**
     * 根据用户ID和通知类型查询通知列表
     *
     * @param userId     用户ID
     * @param noticeType 通知类型
     * @return 通知列表
     */
    List<SysNotice> selectByUserIdAndType(@Param("userId") Long userId, @Param("noticeType") String noticeType);

    /**
     * 批量更新通知为已读状态
     *
     * @param noticeIds  通知ID列表
     * @param readStatus 阅读状态
     * @return 更新记录数
     */
    int batchUpdateReadStatus(@Param("noticeIds") List<Long> noticeIds, @Param("readStatus") Integer readStatus);

    /**
     * 批量更新通知发送状态
     *
     * @param noticeIds  通知ID列表
     * @param sendStatus 发送状态
     * @return 更新记录数
     */
    int batchUpdateSendStatus(@Param("noticeIds") List<Long> noticeIds, @Param("sendStatus") Integer sendStatus);

    /**
     * 逻辑删除通知
     *
     * @param noticeId 通知ID
     * @return 删除记录数
     */
    int logicDelete(@Param("noticeId") Long noticeId);

    /**
     * 根据ID查询通知
     *
     * @param noticeId 通知ID
     * @return 系统通知对象
     */
    SysNotice selectById(@Param("noticeId") Long noticeId);
}