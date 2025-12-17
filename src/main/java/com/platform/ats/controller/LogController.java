package com.platform.ats.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.common.annotation.DataPermission;
import com.platform.ats.common.annotation.LogOperation;
import com.platform.ats.entity.log.SysOperationLog;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.LogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 系统操作日志管理控制器
 *
 * @author Administrator
 * @since 2025-12-18
 */
@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
@Tag(name = "系统操作日志管理")
public class LogController {

    private final LogService logService;

    /**
     * 分页查询操作日志列表
     *
     * @param current 当前页码
     * @param size 每页大小
     * @param userId 用户ID（精确查询）
     * @param operationModule 操作模块（模糊查询）
     * @param operationContent 操作内容（模糊查询）
     * @param ipAddress IP地址（模糊查询）
     * @param operationResult 操作结果（0-失败，1-成功）
     * @return 操作日志分页列表
     */
    @GetMapping("/page")
    @Operation(summary = "分页查询操作日志列表")
    @DataPermission(DataPermission.Type.ALL) // 只有管理员才能查询操作日志
    @LogOperation(module = "系统操作日志管理", type = "查询", content = "分页查询操作日志列表")
    public Result<IPage<SysOperationLog>> getLogPage(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String operationModule,
            @RequestParam(required = false) String operationContent,
            @RequestParam(required = false) String ipAddress,
            @RequestParam(required = false) Integer operationResult) {
        
        Page<SysOperationLog> page = new Page<>(current, size);
        IPage<SysOperationLog> result = logService.getLogPage(page, userId, operationModule, operationContent, ipAddress, operationResult);
        return Result.success(result);
    }

    /**
     * 根据ID获取操作日志详情
     *
     * @param logId 日志ID
     * @return 操作日志详情
     */
    @GetMapping("/{logId}")
    @Operation(summary = "根据ID获取操作日志详情")
    @DataPermission(DataPermission.Type.ALL) // 只有管理员才能查看详情
    @LogOperation(module = "系统操作日志管理", type = "查询", content = "根据ID获取操作日志详情")
    public Result<SysOperationLog> getLogById(@PathVariable Long logId) {
        SysOperationLog log = logService.getById(logId);
        return Result.success(log);
    }
}