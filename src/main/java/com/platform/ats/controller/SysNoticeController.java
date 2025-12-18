package com.platform.ats.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.platform.ats.common.annotation.DataPermission;
import com.platform.ats.common.annotation.LogOperation;
import com.platform.ats.entity.notification.SysNotice;
import com.platform.ats.entity.user.SysUser;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.SysNoticeService;
import com.platform.ats.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * 系统通知控制器
 *
 * @author 杨文轩、王俊杰、蔡卓君、吴建明
 * @since 2025-12-16
 */
@Validated
@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "系统通知")
public class SysNoticeController {

    private final SysNoticeService sysNoticeService;
    private final UserService userService;

    @PostMapping
    @Operation(summary = "创建通知")
    @DataPermission(DataPermission.Type.ALL) // 管理员或系统可以创建通知
    @LogOperation(module = "系统通知", type = "新增", content = "创建系统通知")
    public Result<Long> createNotice(@Valid @RequestBody SysNotice sysNotice) {
        Long noticeId = sysNoticeService.createNotice(sysNotice);
        return Result.success(noticeId, "通知创建成功");
    }

    @GetMapping("/{noticeId}")
    @Operation(summary = "根据ID获取通知")
    @DataPermission(DataPermission.Type.SELF) // 用户只能查看自己的通知
    @LogOperation(module = "系统通知", type = "查询", content = "根据ID获取通知")
    public Result<SysNotice> getNoticeById(@PathVariable Long noticeId) {
        SysNotice sysNotice = sysNoticeService.getNoticeById(noticeId);
        if (sysNotice == null) {
            return Result.error("通知不存在");
        }
        
        // 额外检查通知是否属于当前用户
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long currentUserId = null;
        if (principal instanceof SysUser) {
            currentUserId = ((SysUser) principal).getUserId();
        } else if (principal instanceof String) {
            // 如果是用户名字符串，需要查询用户信息获取userId
            SysUser user = userService.getUserByUsername((String) principal);
            if (user != null) {
                currentUserId = user.getUserId();
            }
        }
        
        if (currentUserId == null || !sysNotice.getUserId().equals(currentUserId)) {
            log.warn("用户ID {} 尝试访问不属于自己的通知 {}", currentUserId, noticeId);
            return Result.error("没有权限访问该通知");
        }
        
        return Result.success(sysNotice);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "根据用户ID获取通知列表")
    @DataPermission(DataPermission.Type.SELF) // 用户只能查看自己的通知
    @LogOperation(module = "系统通知", type = "查询", content = "根据用户ID获取通知列表")
    public Result<List<SysNotice>> getNoticesByUserId(@PathVariable Long userId) {
        List<SysNotice> notices = sysNoticeService.getNoticesByUserId(userId);
        return Result.success(notices);
    }

    @GetMapping("/user/{userId}/page")
    @Operation(summary = "根据用户ID分页获取通知列表")
    @DataPermission(DataPermission.Type.SELF) // 用户只能查看自己的通知
    @LogOperation(module = "系统通知", type = "查询", content = "根据用户ID分页获取通知列表")
    public Result<IPage<SysNotice>> getNoticePageByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        IPage<SysNotice> page = sysNoticeService.getNoticePageByUserId(userId, pageNum, pageSize);
        return Result.success(page);
    }

    @GetMapping("/user/{userId}/unread-count")
    @Operation(summary = "获取用户未读通知数量")
    @DataPermission(DataPermission.Type.SELF) // 用户只能查看自己的未读通知数量
    @LogOperation(module = "系统通知", type = "查询", content = "获取用户未读通知数量")
    public Result<Integer> getUnreadNoticeCount(@PathVariable Long userId) {
        Integer count = sysNoticeService.getUnreadNoticeCount(userId);
        return Result.success(count);
    }

    @PutMapping("/{noticeId}")
    @Operation(summary = "更新通知")
    @DataPermission(DataPermission.Type.ALL) // 管理员或系统可以更新通知
    @LogOperation(module = "系统通知", type = "修改", content = "更新通知")
    public Result<Boolean> updateNotice(@PathVariable Long noticeId, @Valid @RequestBody SysNotice sysNotice) {
        // 确保路径变量和请求体中的noticeId一致
        if (!noticeId.equals(sysNotice.getNoticeId())) {
            return Result.error("路径中的通知ID与请求体中的通知ID不一致");
        }
        Boolean success = sysNoticeService.updateNotice(sysNotice);
        return Result.success(success, "通知更新成功");
    }

    @PutMapping("/{noticeId}/read-status")
    @Operation(summary = "更新通知阅读状态")
    @DataPermission(DataPermission.Type.SELF) // 用户可以更新自己通知的阅读状态
    @LogOperation(module = "系统通知", type = "修改", content = "更新通知阅读状态")
    public Result<Boolean> updateReadStatus(@PathVariable Long noticeId, @RequestParam Integer readStatus) {
        Boolean success = sysNoticeService.updateReadStatus(noticeId, readStatus);
        return Result.success(success, "阅读状态更新成功");
    }

    @PutMapping("/batch-read-status")
    @Operation(summary = "批量更新通知阅读状态")
    @DataPermission(DataPermission.Type.SELF) // 用户可以批量更新自己通知的阅读状态
    @LogOperation(module = "系统通知", type = "修改", content = "批量更新通知阅读状态")
    public Result<Boolean> batchUpdateReadStatus(@RequestBody List<Long> noticeIds, @RequestParam Integer readStatus) {
        Boolean success = sysNoticeService.batchUpdateReadStatus(noticeIds, readStatus);
        return Result.success(success, "批量更新阅读状态成功");
    }

    @DeleteMapping("/{noticeId}")
    @Operation(summary = "删除通知")
    @DataPermission(DataPermission.Type.SELF) // 用户可以删除自己的通知
    @LogOperation(module = "系统通知", type = "删除", content = "删除通知")
    public Result<Boolean> deleteNotice(@PathVariable Long noticeId) {
        Boolean success = sysNoticeService.deleteNotice(noticeId);
        return Result.success(success, "通知删除成功");
    }
}