package com.platform.ats.controller;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.platform.ats.entity.interview.InterviewInfo;
import com.platform.ats.entity.interview.vo.InterviewInfoVO;
import com.platform.ats.entity.interview.vo.InterviewScheduleVO;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.InterviewInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 面试信息管理控制器
 *
 * @author Administrator
 * @since 2025-12-13
 */
@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
@Tag(name = "面试信息管理")
public class InterviewInfoController{

    private final InterviewInfoService interviewInfoService;

    @PostMapping
    @Operation(summary = "创建面试信息")
    public Result<InterviewInfoVO> addInterviewInfo(@RequestBody InterviewInfo interviewInfo){
        return Result.success(interviewInfoService.create(interviewInfo));
    }

    @PutMapping
    @Operation(summary = "更新面试信息")
    public Result<InterviewInfoVO> updateInterviewInfo(@RequestBody InterviewInfo interviewInfo){
        return Result.success(interviewInfoService.update(interviewInfo));
    }

    @DeleteMapping("/{arrangeId}")
    @Operation(summary = "删除面试信息")
    public Result<Boolean> deleteInterviewInfo(@PathVariable("arrangeId") Long arrangeId){
        return Result.success(interviewInfoService.delete(arrangeId));
    }

    @GetMapping("/interviewer/{interviewerId}")
    @Operation(summary = "根据面试官ID获取面试信息")
    public Result<List<InterviewInfoVO>> getInterviewInfoByInterviewerId(@PathVariable("interviewerId") Long interviewerId){
        return Result.success(interviewInfoService.getById(interviewerId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "根据求职者用户ID获取面试信息")
    public Result<List<InterviewScheduleVO>> getInterviewInfoByUserId(@PathVariable("userId") Long userId){
        return Result.success(interviewInfoService.getByUserId(userId));
    }
    
    @GetMapping("/company/{companyId}")
    @Operation(summary = "根据公司ID分页获取面试信息")
    public Result<IPage<InterviewScheduleVO>> getInterviewInfoByCompanyId(
            @PathVariable("companyId") Long companyId,
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "20") Long size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String interviewDate) {
        Page<InterviewScheduleVO> page = new Page<>(current, size);
        IPage<InterviewScheduleVO> result = interviewInfoService.getByCompanyId(page, companyId, status, interviewDate);
        return Result.success(result);
    }
}