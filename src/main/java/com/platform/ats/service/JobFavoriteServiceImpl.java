package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.company.CompanyInfo;
import com.platform.ats.entity.favorite.JobFavorite;
import com.platform.ats.entity.favorite.vo.JobFavoriteVO;
import com.platform.ats.entity.job.JobInfo;
import com.platform.ats.repository.CompanyInfoRepository;
import com.platform.ats.repository.JobFavoriteRepository;
import com.platform.ats.repository.JobInfoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class JobFavoriteServiceImpl implements JobFavoriteService {

    private final JobFavoriteRepository jobFavoriteRepository;
    private final JobInfoRepository jobInfoRepository;
    private final CompanyInfoRepository companyInfoRepository;

    public JobFavoriteServiceImpl(JobFavoriteRepository jobFavoriteRepository,
                                  JobInfoRepository jobInfoRepository,
                                  CompanyInfoRepository companyInfoRepository) {
        this.jobFavoriteRepository = jobFavoriteRepository;
        this.jobInfoRepository = jobInfoRepository;
        this.companyInfoRepository = companyInfoRepository;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addFavorite(Long userId, Long jobId) {
        if (userId == null || jobId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "收藏参数不完整");
        }

        JobInfo jobInfo = jobInfoRepository.selectById(jobId);
        if (jobInfo == null) {
            throw new BizException(ErrorCode.JOB_NOT_FOUND, "职位不存在");
        }

        // 先尝试恢复已逻辑删除的收藏记录
        // 使用原生SQL更新，因为MyBatis Plus的逻辑删除机制会干扰对deleteFlag=1的记录的查询
        int recovered = jobFavoriteRepository.updateDeletedFavoriteToActive(userId, jobId);
        if (recovered > 0) {
            // 恢复成功，直接返回任意一条记录的 ID（这里简单重新查一遍）
            JobFavorite exist = jobFavoriteRepository.selectOne(new LambdaQueryWrapper<JobFavorite>()
                    .eq(JobFavorite::getUserId, userId)
                    .eq(JobFavorite::getJobId, jobId)
                    .eq(JobFavorite::getDeleteFlag, 0));
            return exist != null ? exist.getFavoriteId() : null;
        }

        // 判断是否已存在有效收藏
        Long count = jobFavoriteRepository.selectCount(new LambdaQueryWrapper<JobFavorite>()
                .eq(JobFavorite::getUserId, userId)
                .eq(JobFavorite::getJobId, jobId)
                .eq(JobFavorite::getDeleteFlag, 0));
        if (count != null && count > 0) {
            // 已有有效收藏，直接返回其中一条的 ID
            JobFavorite exist = jobFavoriteRepository.selectOne(new LambdaQueryWrapper<JobFavorite>()
                    .eq(JobFavorite::getUserId, userId)
                    .eq(JobFavorite::getJobId, jobId)
                    .eq(JobFavorite::getDeleteFlag, 0));
            return exist != null ? exist.getFavoriteId() : null;
        }

        // 插入新的收藏记录
        JobFavorite entity = new JobFavorite();
        entity.setUserId(userId);
        entity.setJobId(jobId);
        entity.setCreateTime(LocalDateTime.now());
        entity.setUpdateTime(LocalDateTime.now());
        entity.setDeleteFlag(0);
        jobFavoriteRepository.insert(entity);
        return entity.getFavoriteId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean removeFavorite(Long userId, Long jobId) {
        if (userId == null || jobId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "取消收藏参数不完整");
        }
        // 使用 LambdaUpdateWrapper 直接更新，绕过 MyBatis Plus 逻辑删除拦截
        LambdaUpdateWrapper<JobFavorite> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.set(JobFavorite::getDeleteFlag, 1)
                .eq(JobFavorite::getUserId, userId)
                .eq(JobFavorite::getJobId, jobId)
                .eq(JobFavorite::getDeleteFlag, 0);
        jobFavoriteRepository.update(null, updateWrapper);
        // 无论是否有记录被更新，都认为取消收藏操作成功（幂等）
        return true;
    }

    @Override
    public boolean isFavorited(Long userId, Long jobId) {
        Long count = jobFavoriteRepository.selectCount(new LambdaQueryWrapper<JobFavorite>()
                .eq(JobFavorite::getUserId, userId)
                .eq(JobFavorite::getJobId, jobId)
                .eq(JobFavorite::getDeleteFlag, 0));
        return count != null && count > 0;
    }

    @Override
    public IPage<JobFavoriteVO> pageMyFavorites(Page<JobFavoriteVO> page, Long userId) {
        Page<JobFavorite> entityPage = new Page<>(page.getCurrent(), page.getSize());
        IPage<JobFavorite> res = jobFavoriteRepository.selectPage(entityPage,
                new LambdaQueryWrapper<JobFavorite>()
                        .eq(JobFavorite::getUserId, userId)
                        .eq(JobFavorite::getDeleteFlag, 0)
                        .orderByDesc(JobFavorite::getCreateTime));

        Page<JobFavoriteVO> voPage = new Page<>(res.getCurrent(), res.getSize(), res.getTotal());
        voPage.setRecords(res.getRecords().stream().map(entity -> {
            JobFavoriteVO vo = new JobFavoriteVO();
            BeanUtils.copyProperties(entity, vo);
            JobInfo jobInfo = jobInfoRepository.selectById(entity.getJobId());
            if (jobInfo != null) {
                vo.setJobTitle(jobInfo.getJobName());
                vo.setCompanyId(jobInfo.getCompanyId());
                vo.setDepartment(jobInfo.getDepartment());
                // 获取公司名称
                if (jobInfo.getCompanyId() != null) {
                    CompanyInfo companyInfo = companyInfoRepository.selectById(jobInfo.getCompanyId());
                    if (companyInfo != null) {
                        vo.setCompanyName(companyInfo.getCompanyName());
                    }
                }
            }
            return vo;
        }).toList());
        return voPage;
    }
}
