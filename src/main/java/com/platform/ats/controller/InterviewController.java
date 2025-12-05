package com.platform.ats.controller;

import com.platform.ats.entity.interview.vo.InterviewInfoVO;
import com.platform.ats.service.InterviewService;
import com.platform.ats.entity.interview.vo.ArrangeVO;
import com.platform.ats.entity.interview.vo.AddressVO;
import com.platform.ats.entity.interview.vo.ResultVO;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @PostMapping("/arrange")
    @Operation(summary = "安排面试")
    public Long arrangeInterview(@RequestBody ArrangeVO arrangeVO) {
        return interviewService.arrangeInterview(arrangeVO);
    }

    @PostMapping("/address")
    @Operation(summary = "设置面试地址")
    public Long setInterviewAddress(@RequestBody AddressVO addressVO) {
        return interviewService.setInterviewAddress(addressVO);
    }

    @PostMapping("/result")
    @Operation(summary = "设置面试结果")
    public void setInterviewResult(@RequestBody ResultVO resultVO) {
        interviewService.setInterviewResult(resultVO);
    }

    @GetMapping("/address/{addressId}")
    @Operation(summary = "获取面试地址")
    public AddressVO getInterviewAddress(@PathVariable Long addressId) {
        return interviewService.getInterviewAddress(addressId);
    }

    @GetMapping("/info/{arrangeId}")
    @Operation(summary = "获取面试信息")
    public InterviewInfoVO getInterviewInfo(@PathVariable Long arrangeId) {
        return interviewService.getInterviewInfo(arrangeId);
    }
}
