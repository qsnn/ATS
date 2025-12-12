package com.platform.ats.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.job.JobInfo;
import com.platform.ats.entity.job.dto.JobInfoDetailDto;
import com.platform.ats.entity.job.dto.JobInfoQueryDto;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.JobInfoService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Result<IPage<JobInfoDetailDto>> list(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            JobInfoQueryDto queryDto) {
        
        // 创建分页对象
        Page<JobInfoDetailDto> page = new Page<>(current, size);
        
        IPage<JobInfoDetailDto> resultPage = jobInfoService.findJobPage(page, queryDto);
        return Result.success(resultPage);
    }

    /**
     * 获取所有工作地点
     */
    @GetMapping("/cities")
    public Result<List<String>> getAllCities() {
        List<String> cities = jobInfoService.list().stream()
                .map(JobInfo::getCity)
                .filter(city -> city != null && !city.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        return Result.success(cities);
    }

    /**
     * 根据ID获取职位详情（包含公司名称等关联信息）
     */
    @GetMapping("/{id}")
    public Result<JobInfoDetailDto> getById(@PathVariable Long id) {
        JobInfoQueryDto queryDto = new JobInfoQueryDto();
        queryDto.setJobId(id);
        Page<JobInfoDetailDto> page = new Page<>(1, 1);
        IPage<JobInfoDetailDto> resultPage = jobInfoService.findJobPage(page, queryDto);
        if (resultPage.getRecords() == null || resultPage.getRecords().isEmpty()) {
            return Result.success(null);
        }
        return Result.success(resultPage.getRecords().get(0));
    }
    
    /**
     * 根据ID获取职位信息（用于编辑）
     */
    @GetMapping("/detail/{id}")
    public Result<JobInfo> getDetailById(@PathVariable Long id) {
        JobInfo jobInfo = jobInfoService.getById(id);
        return Result.success(jobInfo);
    }

    /**
     * 创建职位
     */
    @PostMapping
    public Result<Boolean> create(@RequestBody JobInfo jobInfo) {
        boolean result = jobInfoService.saveOrUpdate(jobInfo);
        return Result.success(result, "职位创建成功");
    }

    /**
     * 更新职位
     */
    @PutMapping
    public Result<Boolean> update(@RequestBody JobInfo jobInfo) {
        boolean result = jobInfoService.saveOrUpdate(jobInfo);
        return Result.success(result, "职位更新成功");
    }

    /**
     * 删除职位
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        boolean result = jobInfoService.removeById(id);
        return Result.success(result, "职位删除成功");
    }

    /**
     * 发布职位
     */
    @PutMapping("/publish/{id}")
    public Result<Boolean> publishJob(@PathVariable Long id) {
        boolean result = jobInfoService.publishJob(id);
        return Result.success(result, "职位发布成功");
    }

    /**
     * 下架职位
     */
    @PutMapping("/unpublish/{id}")
    public Result<Boolean> unpublishJob(@PathVariable Long id) {
        boolean result = jobInfoService.unpublishJob(id);
        return Result.success(result, "职位下架成功");
    }
}