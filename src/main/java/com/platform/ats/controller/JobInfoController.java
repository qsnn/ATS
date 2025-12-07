package com.platform.ats.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.job.JobInfo;
import com.platform.ats.entity.job.dto.JobInfoDetailDto;
import com.platform.ats.entity.job.dto.JobInfoQueryDto;
import com.platform.ats.service.JobInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 职位信息 前端控制器
 */
@RestController
@RequestMapping("/api/job/info")
public class JobInfoController {

    @Autowired
    private JobInfoService jobInfoService;

    /**
     * 分页并根据条件筛选职位列表（包含公司名称等详细信息）
     */
    @GetMapping("/list")
    public ResponseEntity<IPage<JobInfoDetailDto>> list(Page<JobInfoDetailDto> page, JobInfoQueryDto queryDto) {
        // 如果没有指定发布状态，默认只查询已发布的职位
        if (queryDto.getPublishStatus() == null) {
            queryDto.setPublishStatus(1);
        }
        
        IPage<JobInfoDetailDto> resultPage = jobInfoService.findJobPage(page, queryDto);
        return ResponseEntity.ok(resultPage);
    }

    /**
     * 根据ID获取职位详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobInfo> getById(@PathVariable Long id) {
        JobInfo jobInfo = jobInfoService.getById(id);
        return ResponseEntity.ok(jobInfo);
    }

    /**
     * 新增或修改职位
     */
    @PostMapping("/saveOrUpdate")
    public ResponseEntity<Boolean> saveOrUpdate(@RequestBody JobInfo jobInfo) {
        return ResponseEntity.ok(jobInfoService.saveOrUpdate(jobInfo));
    }


    /**
     * 根据ID删除职位
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable Long id) {
        return ResponseEntity.ok(jobInfoService.removeById(id));
    }

    /**
     * 发布职位
     */
    @PutMapping("/publish/{jobId}")
    public ResponseEntity<Boolean> publishJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobInfoService.publishJob(jobId));
    }

    /**
     * 下架职位
     */
    @PutMapping("/unpublish/{jobId}")
    public ResponseEntity<Boolean> unpublishJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobInfoService.unpublishJob(jobId));
    }
}