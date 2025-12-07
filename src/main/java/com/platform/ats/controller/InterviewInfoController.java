package com.platform.ats.controller;


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
}
