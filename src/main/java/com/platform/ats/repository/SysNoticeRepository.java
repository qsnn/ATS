package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.notification.SysNotice;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 系统通知数据访问层
 */
public interface SysNoticeRepository extends BaseMapper<SysNotice> {

    /**
     * 根据用户ID查询通知列表
     */
    List<SysNotice> selectByUserId(@Param("userId") Long userId);

    /**
     * 根据用户ID和阅读状态查询通知列表
     */
    List<SysNotice> selectByUserIdAndReadStatus(@Param("userId") Long userId, @Param("readStatus") Integer readStatus);

    /**
     * 根据用户ID分页查询通知列表
     */
    IPage<SysNotice> selectPageByUserId(Page<SysNotice> page, @Param("userId") Long userId);

    /**
     * 根据用户ID和通知类型查询通知列表
     */
    List<SysNotice> selectByUserIdAndType(@Param("userId") Long userId, @Param("noticeType") String noticeType);

    /**
     * 批量更新通知为已读状态
     */
    int batchUpdateReadStatus(@Param("noticeIds") List<Long> noticeIds, @Param("readStatus") Integer readStatus);

    /**
     * 逻辑删除通知
     */
    int logicDelete(@Param("noticeId") Long noticeId);
}