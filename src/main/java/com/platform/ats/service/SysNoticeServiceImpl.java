package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.platform.ats.entity.notification.SysNotice;
import com.platform.ats.repository.SysNoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 系统通知服务实现类
 *
 * @author Administrator
 * @since 2025-12-16
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SysNoticeServiceImpl extends ServiceImpl<SysNoticeRepository, SysNotice> implements SysNoticeService {

    /**
     * 创建通知
     *
     * @param sysNotice 系统通知对象
     * @return 通知ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createNotice(SysNotice sysNotice) {
        this.baseMapper.insert(sysNotice);
        log.info("系统通知创建成功: noticeId={}", sysNotice.getNoticeId());
        return sysNotice.getNoticeId();
    }

    /**
     * 根据ID获取通知
     *
     * @param noticeId 通知ID
     * @return 系统通知对象
     */
    @Override
    public SysNotice getNoticeById(Long noticeId) {
        return this.baseMapper.selectById(noticeId);
    }

    /**
     * 根据用户ID获取通知列表
     *
     * @param userId 用户ID
     * @return 通知列表
     */
    @Override
    public List<SysNotice> getNoticesByUserId(Long userId) {
        return this.baseMapper.selectByUserId(userId);
    }

    /**
     * 根据用户ID和阅读状态获取通知列表
     *
     * @param userId     用户ID
     * @param readStatus 阅读状态
     * @return 通知列表
     */
    @Override
    public List<SysNotice> getNoticesByUserIdAndReadStatus(Long userId, Integer readStatus) {
        return this.baseMapper.selectByUserIdAndReadStatus(userId, readStatus);
    }

    /**
     * 根据用户ID分页获取通知列表
     *
     * @param userId   用户ID
     * @param pageNum  页码
     * @param pageSize 页面大小
     * @return 通知分页列表
     */
    @Override
    public IPage<SysNotice> getNoticePageByUserId(Long userId, Integer pageNum, Integer pageSize) {
        Page<SysNotice> page = new Page<>(pageNum, pageSize);
        return this.baseMapper.selectPageByUserId(page, userId);
    }

    /**
     * 根据用户ID和通知类型获取通知列表
     *
     * @param userId     用户ID
     * @param noticeType 通知类型
     * @return 通知列表
     */
    @Override
    public List<SysNotice> getNoticesByUserIdAndType(Long userId, String noticeType) {
        return this.baseMapper.selectByUserIdAndType(userId, noticeType);
    }

    /**
     * 更新通知
     *
     * @param sysNotice 系统通知对象
     * @return 是否更新成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateNotice(SysNotice sysNotice) {
        return this.baseMapper.updateById(sysNotice) > 0;
    }

    /**
     * 更新通知阅读状态
     *
     * @param noticeId   通知ID
     * @param readStatus 阅读状态
     * @return 是否更新成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateReadStatus(Long noticeId, Integer readStatus) {
        SysNotice sysNotice = new SysNotice();
        sysNotice.setNoticeId(noticeId);
        sysNotice.setReadStatus(readStatus);
        return this.baseMapper.updateById(sysNotice) > 0;
    }

    /**
     * 批量更新通知阅读状态
     *
     * @param noticeIds  通知ID列表
     * @param readStatus 阅读状态
     * @return 是否更新成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean batchUpdateReadStatus(List<Long> noticeIds, Integer readStatus) {
        return this.baseMapper.batchUpdateReadStatus(noticeIds, readStatus) > 0;
    }

    /**
     * 更新通知发送状态
     *
     * @param noticeId   通知ID
     * @param sendStatus 发送状态
     * @return 是否更新成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateSendStatus(Long noticeId, Integer sendStatus) {
        SysNotice sysNotice = new SysNotice();
        sysNotice.setNoticeId(noticeId);
        sysNotice.setSendStatus(sendStatus);
        return this.baseMapper.updateById(sysNotice) > 0;
    }

    /**
     * 批量更新通知发送状态
     *
     * @param noticeIds  通知ID列表
     * @param sendStatus 发送状态
     * @return 是否更新成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean batchUpdateSendStatus(List<Long> noticeIds, Integer sendStatus) {
        return this.baseMapper.batchUpdateSendStatus(noticeIds, sendStatus) > 0;
    }

    /**
     * 删除通知（逻辑删除）
     *
     * @param noticeId 通知ID
     * @return 是否删除成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean deleteNotice(Long noticeId) {
        return this.baseMapper.logicDelete(noticeId) > 0;
    }

    /**
     * 获取用户未读通知数量
     *
     * @param userId 用户ID
     * @return 未读通知数量
     */
    @Override
    public Integer getUnreadNoticeCount(Long userId) {
        return this.baseMapper.selectByUserIdAndReadStatus(userId, 0).size();
    }
}