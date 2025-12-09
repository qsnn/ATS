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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
    public ResponseEntity<IPage<JobInfoDetailDto>> list(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            JobInfoQueryDto queryDto) {
        
        // 创建分页对象
        Page<JobInfoDetailDto> page = new Page<>(current, size);
        
        try {
            IPage<JobInfoDetailDto> resultPage = jobInfoService.findJobPage(page, queryDto);
            return ResponseEntity.ok(resultPage);
        } catch (Exception e) {
            e.printStackTrace(); // 临时打印异常堆栈，方便定位问题
            throw e; // 重新抛出异常，让全局异常处理器处理
        }
    }

    /**
     * 获取所有工作地点
     */
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAllCities() {
        try {
            List<String> cities = jobInfoService.list().stream()
                    .map(JobInfo::getCity)
                    .filter(city -> city != null && !city.isEmpty())
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());
            return ResponseEntity.ok(cities);
        } catch (Exception e) {
            // 发生异常时返回空列表而不是500错误
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * 根据ID获取职位详情（包含公司名称等关联信息）
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobInfoDetailDto> getById(@PathVariable Long id) {
        JobInfoQueryDto queryDto = new JobInfoQueryDto();
        queryDto.setJobId(id);
        Page<JobInfoDetailDto> page = new Page<>(1, 1);
        IPage<JobInfoDetailDto> resultPage = jobInfoService.findJobPage(page, queryDto);
        if (resultPage.getRecords() == null || resultPage.getRecords().isEmpty()) {
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(resultPage.getRecords().get(0));
    }
    
    /**
     * 根据ID获取职位信息（用于编辑）
     */
    @GetMapping("/detail/{id}")
    public ResponseEntity<JobInfo> getDetailById(@PathVariable Long id) {
        JobInfo jobInfo = jobInfoService.getById(id);
        return ResponseEntity.ok(jobInfo);
    }

    /**
     * 创建职位
     */
    @PostMapping
    public ResponseEntity<Boolean> create(@RequestBody JobInfo jobInfo) {
        boolean result = jobInfoService.saveOrUpdate(jobInfo);
        return ResponseEntity.ok(result);
    }

    /**
     * 更新职位
     */
    @PutMapping
    public ResponseEntity<Boolean> update(@RequestBody JobInfo jobInfo) {
        boolean result = jobInfoService.saveOrUpdate(jobInfo);
        return ResponseEntity.ok(result);
    }

    /**
     * 删除职位
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable Long id) {
        boolean result = jobInfoService.removeById(id);
        return ResponseEntity.ok(result);
    }

    /**
     * 发布职位
     */
    @PutMapping("/publish/{id}")
    public ResponseEntity<Boolean> publishJob(@PathVariable Long id) {
        boolean result = jobInfoService.publishJob(id);
        return ResponseEntity.ok(result);
    }

    /**
     * 下架职位
     */
    @PutMapping("/unpublish/{id}")
    public ResponseEntity<Boolean> unpublishJob(@PathVariable Long id) {
        boolean result = jobInfoService.unpublishJob(id);
        return ResponseEntity.ok(result);
    }
}