package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.job.JobInfo;
import com.platform.ats.entity.job.dto.JobInfoDetailDto;
import com.platform.ats.entity.job.dto.JobInfoQueryDto;
import com.platform.ats.repository.JobInfoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobInfoServiceImpl extends ServiceImpl<JobInfoRepository, JobInfo> implements JobInfoService {

    private final JobInfoRepository jobInfoRepository;

    public JobInfoServiceImpl(JobInfoRepository jobInfoRepository) {
        this.jobInfoRepository = jobInfoRepository;
    }

    /**
     * 发布职位
     *
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
     *
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
        QueryWrapper<JobInfoDetailDto> queryWrapper = new QueryWrapper<>();
        
        // 添加筛选条件
        if (queryDto.getJobName() != null && !queryDto.getJobName().isEmpty()) {
            queryWrapper.like("ji.job_name", queryDto.getJobName());
        }
        
        if (queryDto.getCity() != null && !queryDto.getCity().isEmpty()) {
            queryWrapper.eq("ji.city", queryDto.getCity());
        }
        
        // 添加发布状态筛选条件
        if (queryDto.getPublishStatus() != null) {
            queryWrapper.eq("ji.publish_status", queryDto.getPublishStatus());
        }
        
        // 学历要求筛选逻辑修改：硕士包含本科和大专，本科包含大专
        if (queryDto.getEducation() != null && !queryDto.getEducation().isEmpty()) {
            List<String> educations = new ArrayList<>();
            switch (queryDto.getEducation()) {
                case "硕士":
                    educations.add("硕士");
                    educations.add("本科");
                    educations.add("大专");
                    break;
                case "本科":
                    educations.add("本科");
                    educations.add("大专");
                    break;
                case "大专":
                    educations.add("大专");
                    break;
                default:
                    educations.add(queryDto.getEducation());
                    break;
            }
            queryWrapper.in("ji.education", educations);
        }
        
        // 工作经验筛选逻辑：求职者希望找到经验要求不超过自己经验的职位
        if (queryDto.getWorkExperience() != null) {
            queryWrapper.le("ji.work_experience", queryDto.getWorkExperience());
        }
        
        // 添加薪资筛选条件
        if (queryDto.getSalaryMin() != null) {
            queryWrapper.ge("ji.salary_max", queryDto.getSalaryMin());
        }
        
        if (queryDto.getSalaryMax() != null) {
            queryWrapper.le("ji.salary_min", queryDto.getSalaryMax());
        }
        
        // 添加排序
        if (queryDto.getOrderBy() != null && !queryDto.getOrderBy().isEmpty()) {
            String direction = "ASC";
            if (queryDto.getOrderDirection() != null && queryDto.getOrderDirection().equalsIgnoreCase("DESC")) {
                direction = "DESC";
            }
            
            switch (queryDto.getOrderBy()) {
                case "salary_max":
                    queryWrapper.orderBy(true, direction.equals("DESC"), "ji.salary_max");
                    break;
                case "salary_min":
                    queryWrapper.orderBy(true, direction.equals("DESC"), "ji.salary_min");
                    break;
                case "update_time":
                default:
                    queryWrapper.orderBy(true, direction.equals("DESC"), "ji.update_time");
                    break;
            }
        } else {
            // 默认按更新时间倒序排列
            queryWrapper.orderBy(true, false, "ji.update_time");
        }
        
        // baseMapper 是 ServiceImpl 内置的与 Repository/Mapper 对应的对象
        return jobInfoRepository.findJobPage(page, queryDto, queryWrapper);
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
                throw new BizException(ErrorCode.JOB_SALARY_RANGE_INVALID, "最低薪资不能高于最高薪资");
            }
        }
        // 例如：如果职位ID为空，则为新增，设置默认状态为草稿
        if (jobInfo.getJobId() == null) {
            jobInfo.setPublishStatus(0); // 0-草稿
        }
        return super.saveOrUpdate(jobInfo);
    }
}