package com.platform.ats.controller;

import com.platform.ats.common.annotation.LogOperation;
import com.platform.ats.entity.resume.vo.ResumeInfoVo;
import com.platform.ats.entity.resume.dto.ResumeInfoDTO;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.ResumeInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
@Tag(name = "简历管理")
public class ResumeInfoController {

    private final ResumeInfoService resumeInfoService;

    public ResumeInfoController(ResumeInfoService resumeInfoService) {
        this.resumeInfoService = resumeInfoService;
    }

    @PostMapping
    @Operation(summary = "创建简历")
    @LogOperation(module = "简历管理", type = "新增", content = "创建简历")
    public Result<ResumeInfoVo> create(@RequestBody ResumeInfoDTO resumeInfoDTO) {
        return Result.success(resumeInfoService.create(resumeInfoDTO));
    }

    @PutMapping
    @Operation(summary = "更新简历")
    @LogOperation(module = "简历管理", type = "修改", content = "更新简历")
    public Result<ResumeInfoVo> update(@RequestBody ResumeInfoDTO resumeInfoDTO) {
        return Result.success(resumeInfoService.update(resumeInfoDTO));
    }

    @DeleteMapping("/{resumeId}")
    @Operation(summary = "删除简历")
    @LogOperation(module = "简历管理", type = "删除", content = "删除简历")
    public Result<Boolean> delete(@PathVariable Long resumeId) {
        return Result.success(resumeInfoService.delete(resumeId));
    }

    @GetMapping("/{resumeId}")
    @Operation(summary = "获取简历详情")
    @LogOperation(module = "简历管理", type = "查询", content = "获取简历详情")
    public Result<ResumeInfoDTO> getById(@PathVariable Long resumeId) {
        return Result.success(resumeInfoService.getById(resumeId));
    }

    @GetMapping("/list")
    @Operation(summary = "获取简历列表")
    @LogOperation(module = "简历管理", type = "查询", content = "获取简历列表")
    public Result<List<ResumeInfoDTO>> listAll() {
        return Result.success(resumeInfoService.listAll());
    }
    @GetMapping("/user/{userId}")
    @Operation(summary = "根据用户id获取简历列表")
    @LogOperation(module = "简历管理", type = "查询", content = "根据用户id获取简历列表")
    public Result<List<ResumeInfoDTO>> listByUserId(@PathVariable Long userId) {
        return Result.success(resumeInfoService.listByUserId(userId));
    }
}
