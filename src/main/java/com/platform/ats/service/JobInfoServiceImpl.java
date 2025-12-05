package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.platform.ats.entity.job.JobInfo;
import com.platform.ats.entity.job.dto.JobInfoDetailDto;
import com.platform.ats.entity.job.dto.JobInfoQueryDto;
import com.platform.ats.repository.JobInfoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 职位信息表 服务实现类
 */
@Service
public class JobInfoServiceImpl extends ServiceImpl<JobInfoRepository, JobInfo> implements JobInfoService {

    /**
     * 发布职位
     * @param jobId 职位ID
     * @return 是否成功
     */
    @Override
    @Transactional
    public boolean publishJob(Long jobId) {
        JobInfo jobInfo = new JobInfo();
        jobInfo.setJobId(jobId);
        jobInfo.setPublishStatus(1); // 1-已发布
        return this.updateById(jobInfo);
    }

    /**
     * 下架职位
     * @param jobId 职位ID
     * @return 是否成功
     */
    @Override
    @Transactional
    public boolean unpublishJob(Long jobId) {
        JobInfo jobInfo = new JobInfo();
        jobInfo.setJobId(jobId);
        jobInfo.setPublishStatus(2); // 2-已下架
        return this.updateById(jobInfo);
    }

    /**
     * 分页查询职位列表（包含公司名称等关联信息）
     * @param page 分页参数
     * @param queryDto 查询条件
     * @return 分页结果
     */
    @Override
    public IPage<JobInfoDetailDto> findJobPage(Page<JobInfoDetailDto> page, JobInfoQueryDto queryDto) {
        // baseMapper 是 ServiceImpl 内置的与 Repository/Mapper 对应的对象
        return baseMapper.findJobPage(page, queryDto);
    }

    /**
     * 创建或更新职位信息
     * @param jobInfo 职位信息实体
     * @return 是否成功
     */
    @Override
    @Transactional
    public boolean saveOrUpdate(JobInfo jobInfo) {
        // 可以在这里添加业务校验逻辑
        // 例如：校验薪资范围
        if (jobInfo.getSalaryMin() != null && jobInfo.getSalaryMax() != null) {
            if (jobInfo.getSalaryMin().compareTo(jobInfo.getSalaryMax()) > 0) {
                throw new IllegalArgumentException("最低薪资不能高于最高薪资");
            }
        }
        // 例如：如果职位ID为空，则为新增，设置默认状态为草稿
        if (jobInfo.getJobId() == null) {
            jobInfo.setPublishStatus(0); // 0-草稿
        }
        return super.saveOrUpdate(jobInfo);
    }
}