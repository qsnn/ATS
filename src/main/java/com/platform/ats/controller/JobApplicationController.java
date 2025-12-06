package com.platform.ats.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.application.dto.JobApplicationCreateDTO;
import com.platform.ats.entity.application.vo.JobApplicationVO;
import com.platform.ats.entity.application.vo.JobApplicationEmployerVO;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.JobApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "职位申请管理")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping
    @Operation(summary = "申请职位")
    public Result<Long> apply(@RequestBody JobApplicationCreateDTO dto) {
        Long id = jobApplicationService.apply(dto);
        return Result.success(id);
    }

    @GetMapping("/my")
    @Operation(summary = "分页查询我的申请记录")
    public Result<IPage<JobApplicationVO>> pageMyApplications(@RequestParam Long userId,
                                                              @RequestParam(defaultValue = "1") long current,
                                                              @RequestParam(defaultValue = "10") long size,
                                                              @RequestParam(required = false) String status) {
        Page<JobApplicationVO> page = new Page<>(current, size);
        IPage<JobApplicationVO> res = jobApplicationService.pageMyApplications(page, userId, status);
        return Result.success(res);
    }

    // Employer 视角：按公司分页查询所有职位的申请人
    @GetMapping("/company/{companyId}")
    @Operation(summary = "分页查询公司所有职位的申请记录（企业端）")
    public Result<IPage<JobApplicationEmployerVO>> pageCompanyApplications(@PathVariable Long companyId,
                                                                           @RequestParam(defaultValue = "1") long current,
                                                                           @RequestParam(defaultValue = "10") long size,
                                                                           @RequestParam(required = false) String status) {
        Page<JobApplicationEmployerVO> page = new Page<>(current, size);
        IPage<JobApplicationEmployerVO> res = jobApplicationService.pageCompanyApplications(page, companyId, status);
        return Result.success(res);
    }

    // Employer 视角：按职位查询该职位下的所有申请人
    @GetMapping("/job/{jobId}")
    @Operation(summary = "查询某职位下的申请记录（企业端）")
    public Result<java.util.List<JobApplicationEmployerVO>> listJobApplications(@PathVariable Long jobId) {
        java.util.List<JobApplicationEmployerVO> list = jobApplicationService.listJobApplications(jobId);
        return Result.success(list);
    }
}
