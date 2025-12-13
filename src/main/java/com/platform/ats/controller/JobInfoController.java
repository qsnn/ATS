package com.platform.ats.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.common.annotation.DataPermission;
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
 * 职位信息前端控制器
 *
 * @author Administrator
 * @since 2025-12-13
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
    @DataPermission(DataPermission.Type.ALL) // 所有登录用户都可以查看职位列表
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
    @DataPermission(DataPermission.Type.ALL) // 所有登录用户都可以获取城市列表
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
    @DataPermission(DataPermission.Type.ALL) // 所有登录用户都可以查看职位详情
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
    @DataPermission(DataPermission.Type.COMPANY) // 只有同公司的HR才能编辑职位
    public Result<JobInfo> getDetailById(@PathVariable Long id) {
        JobInfo jobInfo = jobInfoService.getById(id);
        return Result.success(jobInfo);
    }

    /**
     * 创建职位
     */
    @PostMapping
    @DataPermission(DataPermission.Type.COMPANY) // 只有HR可以创建职位
    public Result<Boolean> create(@RequestBody JobInfo jobInfo) {
        boolean result = jobInfoService.saveOrUpdate(jobInfo);
        return Result.success(result, "职位创建成功");
    }

    /**
     * 更新职位
     */
    @PutMapping
    @DataPermission(DataPermission.Type.COMPANY) // 只有同公司的HR才能更新职位
    public Result<Boolean> update(@RequestBody JobInfo jobInfo) {
        boolean result = jobInfoService.saveOrUpdate(jobInfo);
        return Result.success(result, "职位更新成功");
    }

    /**
     * 删除职位
     */
    @DeleteMapping("/{id}")
    @DataPermission(DataPermission.Type.COMPANY) // 只有同公司的HR才能删除职位
    public Result<Boolean> delete(@PathVariable Long id) {
        boolean result = jobInfoService.removeById(id);
        return Result.success(result, "职位删除成功");
    }

    /**
     * 发布职位
     */
    @PutMapping("/publish/{id}")
    @DataPermission(DataPermission.Type.COMPANY) // 只有同公司的HR才能发布职位
    public Result<Boolean> publishJob(@PathVariable Long id) {
        boolean result = jobInfoService.publishJob(id);
        return Result.success(result, "职位发布成功");
    }

    /**
     * 下架职位
     */
    @PutMapping("/unpublish/{id}")
    @DataPermission(DataPermission.Type.COMPANY) // 只有同公司的HR才能下架职位
    public Result<Boolean> unpublishJob(@PathVariable Long id) {
        boolean result = jobInfoService.unpublishJob(id);
        return Result.success(result, "职位下架成功");
    }
}