package com.platform.ats.controller;

import com.platform.ats.entity.company.CompanyInfo;
import com.platform.ats.entity.company.vo.CompanyInfoVO;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.CompanyInfoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company")
public class CompanyInfoController {

    private final CompanyInfoService companyInfoService;

    public CompanyInfoController(CompanyInfoService companyInfoService) {
        this.companyInfoService = companyInfoService;
    }

    @PostMapping
    public Result<CompanyInfoVO> create(@RequestBody CompanyInfo companyInfo) {
        return Result.success(companyInfoService.create(companyInfo));
    }

    @PutMapping
    public Result<CompanyInfoVO> update(@RequestBody CompanyInfo companyInfo) {
        return Result.success(companyInfoService.update(companyInfo));
    }

    @DeleteMapping("/{companyId}")
    public Result<Boolean> delete(@PathVariable Long companyId) {
        return Result.success(companyInfoService.delete(companyId));
    }

    @GetMapping("/{companyId}")
    public Result<CompanyInfoVO> getById(@PathVariable Long companyId) {
        return Result.success(companyInfoService.getById(companyId));
    }

    @GetMapping("/list")
    public Result<List<CompanyInfoVO>> listAll() {
        return Result.success(companyInfoService.listAll());
    }
}