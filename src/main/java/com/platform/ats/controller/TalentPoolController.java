package com.platform.ats.controller;

import com.platform.ats.entity.company.TalentPool;
import com.platform.ats.entity.company.vo.TalentPoolDetailVO;
import com.platform.ats.entity.company.vo.TalentPoolVO;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.TalentPoolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/talent")
@RequiredArgsConstructor
@Tag(name = "人才库管理")
public class TalentPoolController {

    private final TalentPoolService talentPoolService;

    @PostMapping
    @Operation(summary = "新增人才")
    public Result<TalentPoolVO> create(@RequestBody TalentPool talentPool) {
        return Result.success(talentPoolService.create(talentPool));
    }

    @PutMapping
    @Operation(summary = "修改人才")
    public Result<TalentPoolVO> update(@RequestBody TalentPool talentPool) {
        return Result.success(talentPoolService.update(talentPool));
    }

    @DeleteMapping("/{talentId}")
    @Operation(summary = "删除人才")
    public Result<Boolean> delete(@PathVariable Long talentId) {
        return Result.success(talentPoolService.delete(talentId));
    }

    @GetMapping("/{talentId}")
    @Operation(summary = "根据ID查询人才")
    public Result<TalentPoolVO> getById(@PathVariable Long talentId) {
        return Result.success(talentPoolService.getById(talentId));
    }

    @GetMapping("/company/{companyId}")
    @Operation(summary = "根据公司ID查询人才列表")
    public Result<List<TalentPoolDetailVO>> listByCompanyId(@PathVariable Long companyId) {
        return Result.success(talentPoolService.listDetailByCompanyId(companyId));
    }
}