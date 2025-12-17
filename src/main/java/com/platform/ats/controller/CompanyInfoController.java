package com.platform.ats.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.common.annotation.LogOperation;
import com.platform.ats.entity.company.CompanyInfo;
import com.platform.ats.entity.company.dto.CompanyQueryDTO;
import com.platform.ats.entity.company.vo.CompanyInfoVO;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.CompanyInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 公司信息管理控制器
 *
 * @author Administrator
 * @since 2025-12-13
 */
@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
@Tag(name = "公司信息管理")
public class CompanyInfoController {

    private final CompanyInfoService companyInfoService;

    @PostMapping
    @Operation(summary = "新增公司")
    @LogOperation(module = "公司信息管理", type = "新增", content = "新增公司")
    public Result<CompanyInfoVO> create(@RequestBody CompanyInfo companyInfo) {
        return Result.success(companyInfoService.create(companyInfo));
    }

    @PutMapping
    @Operation(summary = "修改公司")
    @LogOperation(module = "公司信息管理", type = "修改", content = "修改公司")
    public Result<CompanyInfoVO> update(@RequestBody CompanyInfo companyInfo) {
        return Result.success(companyInfoService.update(companyInfo));
    }

    @DeleteMapping("/{companyId}")
    @Operation(summary = "删除公司")
    @LogOperation(module = "公司信息管理", type = "删除", content = "删除公司")
    public Result<Boolean> delete(@PathVariable Long companyId) {
        return Result.success(companyInfoService.delete(companyId));
    }

    @GetMapping("/{companyId}")
    @Operation(summary = "根据ID查询公司")
    @LogOperation(module = "公司信息管理", type = "查询", content = "根据ID查询公司")
    public Result<CompanyInfoVO> getById(@PathVariable Long companyId) {
        return Result.success(companyInfoService.getById(companyId));
    }

    @GetMapping("/list")
    @Operation(summary = "查询全部公司列表")
    @LogOperation(module = "公司信息管理", type = "查询", content = "查询全部公司列表")
    public Result<List<CompanyInfoVO>> listAll() {
        return Result.success(companyInfoService.listAll());
    }
    
    @GetMapping("/page")
    @Operation(summary = "分页查询公司列表")
    @LogOperation(module = "公司信息管理", type = "查询", content = "分页查询公司列表")
    public Result<IPage<CompanyInfoVO>> getCompanyPage(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) Integer status) {
        
        Page<CompanyInfoVO> page = new Page<>(current, size);
        CompanyQueryDTO query = new CompanyQueryDTO();
        query.setCompanyName(companyName);
        query.setStatus(status);
        
        IPage<CompanyInfoVO> result = companyInfoService.getCompanyPage(page, query);
        return Result.success(result);
    }
    
    @PutMapping("/{companyId}/status")
    @Operation(summary = "更新公司状态")
    @LogOperation(module = "公司信息管理", type = "修改", content = "更新公司状态")
    public Result<Boolean> updateStatus(@PathVariable Long companyId, @RequestParam Integer status) {
        Boolean success = companyInfoService.updateStatus(companyId, status);
        return Result.success(success, "状态更新成功");
    }
}