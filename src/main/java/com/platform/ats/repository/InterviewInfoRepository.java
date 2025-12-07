package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
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
}
