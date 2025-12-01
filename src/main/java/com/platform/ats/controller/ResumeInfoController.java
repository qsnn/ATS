package com.platform.ats.controller;

import com.platform.ats.entity.resume.vo.ResumeInfoVo;
import com.platform.ats.entity.resume.dto.ResumeInfoDTO;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.ResumeInfoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class ResumeInfoController {

    private final ResumeInfoService resumeInfoService;

    public ResumeInfoController(ResumeInfoService resumeInfoService) {
        this.resumeInfoService = resumeInfoService;
    }

    @PostMapping
    public Result<ResumeInfoVo> create(@RequestBody ResumeInfoDTO resumeInfoDTO) {
        return Result.success(resumeInfoService.create(resumeInfoDTO));
    }

    @PutMapping
    public Result<ResumeInfoVo> update(@RequestBody ResumeInfoDTO resumeInfoDTO) {
        return Result.success(resumeInfoService.update(resumeInfoDTO));
    }

    @DeleteMapping("/{resumeId}")
    public Result<Boolean> delete(@PathVariable Long resumeId) {
        return Result.success(resumeInfoService.delete(resumeId));
    }

    @GetMapping("/{resumeId}")
    public Result<ResumeInfoDTO> getById(@PathVariable Long resumeId) {
        return Result.success(resumeInfoService.getById(resumeId));
    }

    @GetMapping("/list")
    public Result<List<ResumeInfoDTO>> listAll() {
        return Result.success(resumeInfoService.listAll());
    }
}
