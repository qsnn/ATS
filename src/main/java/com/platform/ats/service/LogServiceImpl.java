package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.platform.ats.entity.log.SysOperationLog;
import com.platform.ats.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 操作日志服务实现类
 */
@Service
@RequiredArgsConstructor
public class LogServiceImpl extends ServiceImpl<LogRepository, SysOperationLog> implements LogService {
    
    /**
     * 分页查询操作日志列表
     *
     * @param page 分页参数
     * @param userId 用户ID（精确查询）
     * @param operationModule 操作模块（模糊查询）
     * @param operationContent 操作内容（模糊查询）
     * @param ipAddress IP地址（模糊查询）
     * @param operationResult 操作结果（0-失败，1-成功）
     * @return 操作日志分页列表
     */
    @Override
    public IPage<SysOperationLog> getLogPage(Page<SysOperationLog> page, 
                                             Long userId,
                                             String operationModule, 
                                             String operationContent, 
                                             String ipAddress, 
                                             Integer operationResult) {
        LambdaQueryWrapper<SysOperationLog> queryWrapper = new LambdaQueryWrapper<>();
        
        // 精确匹配用户ID
        if (userId != null) {
            queryWrapper.eq(SysOperationLog::getUserId, userId);
        }
        
        // 模糊查询操作模块
        if (StringUtils.hasText(operationModule)) {
            queryWrapper.like(SysOperationLog::getOperationModule, operationModule);
        }
        
        // 模糊查询操作内容
        if (StringUtils.hasText(operationContent)) {
            queryWrapper.like(SysOperationLog::getOperationContent, operationContent);
        }
        
        // 模糊查询IP地址
        if (StringUtils.hasText(ipAddress)) {
            queryWrapper.like(SysOperationLog::getIpAddress, ipAddress);
        }
        
        // 精确匹配操作结果
        if (operationResult != null) {
            queryWrapper.eq(SysOperationLog::getOperationResult, operationResult);
        }
        
        // 按操作时间倒序排列
        queryWrapper.orderByDesc(SysOperationLog::getOperationTime);
        
        return this.page(page, queryWrapper);
    }
}