package com.platform.ats.controller;

import com.platform.ats.entity.company.TalentPool;
import com.platform.ats.entity.company.vo.TalentPoolVO;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.TalentPoolService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/talent")
public class TalentPoolController {

    private final TalentPoolService talentPoolService;

    public TalentPoolController(TalentPoolService talentPoolService) {
        this.talentPoolService = talentPoolService;
    }

    @PostMapping
    public Result<TalentPoolVO> create(@RequestBody TalentPool talentPool) {
        return Result.success(talentPoolService.create(talentPool));
    }

    @PutMapping
    public Result<TalentPoolVO> update(@RequestBody TalentPool talentPool) {
        return Result.success(talentPoolService.update(talentPool));
    }

    @DeleteMapping("/{talentId}")
    public Result<Boolean> delete(@PathVariable Long talentId) {
        return Result.success(talentPoolService.delete(talentId));
    }

    @GetMapping("/{talentId}")
    public Result<TalentPoolVO> getById(@PathVariable Long talentId) {
        return Result.success(talentPoolService.getById(talentId));
    }

    @GetMapping("/company/{companyId}")
    public Result<List<TalentPoolVO>> listByCompanyId(@PathVariable Long companyId) {
        return Result.success(talentPoolService.listByCompanyId(companyId));
    }
}