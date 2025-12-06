package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.favorite.JobFavorite;
import com.platform.ats.entity.favorite.vo.JobFavoriteVO;
import com.platform.ats.entity.job.JobInfo;
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

    public JobFavoriteServiceImpl(JobFavoriteRepository jobFavoriteRepository,
                                  JobInfoRepository jobInfoRepository) {
        this.jobFavoriteRepository = jobFavoriteRepository;
        this.jobInfoRepository = jobInfoRepository;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addFavorite(Long userId, Long jobId) {
        if (userId == null || jobId == null) {
            throw new BizException(ErrorCode.BAD_REQUEST, "收藏参数不完整");
        }

        JobInfo jobInfo = jobInfoRepository.selectById(jobId);
        if (jobInfo == null) {
            throw new BizException(ErrorCode.NOT_FOUND, "职位不存在");
        }

        JobFavorite exist = jobFavoriteRepository.selectOne(new LambdaQueryWrapper<JobFavorite>()
                .eq(JobFavorite::getUserId, userId)
                .eq(JobFavorite::getJobId, jobId));
        if (exist != null) {
            if (exist.getDeleteFlag() != null && exist.getDeleteFlag() == 1) {
                exist.setDeleteFlag(0);
                exist.setUpdateTime(LocalDateTime.now());
                jobFavoriteRepository.updateById(exist);
            }
            return exist.getFavoriteId();
        }

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
            throw new BizException(ErrorCode.BAD_REQUEST, "取消收藏参数不完整");
        }
        JobFavorite exist = jobFavoriteRepository.selectOne(new LambdaQueryWrapper<JobFavorite>()
                .eq(JobFavorite::getUserId, userId)
                .eq(JobFavorite::getJobId, jobId));
        if (exist == null) {
            return true;
        }
        exist.setDeleteFlag(1);
        exist.setUpdateTime(LocalDateTime.now());
        jobFavoriteRepository.updateById(exist);
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
            }
            return vo;
        }).toList());
        return voPage;
    }
}

