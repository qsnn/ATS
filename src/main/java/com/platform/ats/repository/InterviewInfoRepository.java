package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.interview.InterviewInfo;
import com.platform.ats.entity.interview.vo.InterviewScheduleVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 面试安排数据访问
 */
public interface InterviewInfoRepository extends BaseMapper<InterviewInfo> {

    /**
     * 求职者侧：根据用户ID查询其相关面试安排（包含职位和公司信息）
     */
    List<InterviewScheduleVO> selectScheduleByUserId(@Param("userId") Long userId);
    
    /**
     * 企业侧面试列表：根据 companyId 关联职位和面试者信息
     *
     * @param page       分页参数
     * @param companyId  公司ID
     * @param status     状态
     * @param interviewDate 面试日期（可选）
     * @return 面试安排分页结果
     */
    IPage<InterviewScheduleVO> selectScheduleByCompanyId(Page<InterviewScheduleVO> page, @Param("companyId") Long companyId, 
                                                     @Param("status") String status, @Param("interviewDate") String interviewDate);
}