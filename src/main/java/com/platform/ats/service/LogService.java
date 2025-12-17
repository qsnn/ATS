package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.platform.ats.entity.log.SysOperationLog;

/**
 * 操作日志服务接口
 */
public interface LogService extends IService<SysOperationLog> {
    
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
    IPage<SysOperationLog> getLogPage(Page<SysOperationLog> page, 
                                      Long userId,
                                      String operationModule, 
                                      String operationContent, 
                                      String ipAddress, 
                                      Integer operationResult);
}