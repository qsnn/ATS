package com.platform.ats.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.favorite.dto.JobFavoriteCreateDTO;
import com.platform.ats.entity.favorite.vo.JobFavoriteVO;
import com.platform.ats.entity.user.vo.Result;
import com.platform.ats.service.JobFavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "职位收藏管理")
public class JobFavoriteController {

    private final JobFavoriteService jobFavoriteService;

    @PostMapping
    @Operation(summary = "收藏职位")
    public Result<Long> addFavorite(@RequestBody JobFavoriteCreateDTO dto) {
        Long id = jobFavoriteService.addFavorite(dto.getUserId(), dto.getJobId());
        return Result.success(id);
    }

    @DeleteMapping
    @Operation(summary = "取消收藏")
    public Result<Boolean> removeFavorite(@RequestParam Long userId,
                                          @RequestParam Long jobId) {
        boolean ok = jobFavoriteService.removeFavorite(userId, jobId);
        return Result.success(ok);
    }

    @GetMapping("/check")
    @Operation(summary = "检查是否已收藏")
    public Result<Boolean> checkFavorite(@RequestParam Long userId,
                                         @RequestParam Long jobId) {
        boolean favorited = jobFavoriteService.isFavorited(userId, jobId);
        return Result.success(favorited);
    }

    @GetMapping("/my")
    @Operation(summary = "分页查询我的收藏职位")
    public Result<IPage<JobFavoriteVO>> pageMyFavorites(@RequestParam Long userId,
                                                        @RequestParam(defaultValue = "1") long current,
                                                        @RequestParam(defaultValue = "10") long size) {
        Page<JobFavoriteVO> page = new Page<>(current, size);
        IPage<JobFavoriteVO> res = jobFavoriteService.pageMyFavorites(page, userId);
        return Result.success(res);
    }
}

