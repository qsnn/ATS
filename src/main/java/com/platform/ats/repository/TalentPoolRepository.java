package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.platform.ats.entity.talentpool.TalentPool;
import com.platform.ats.entity.talentpool.vo.TalentPoolDetailVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 人才库数据访问层
 */
public interface TalentPoolRepository extends BaseMapper<TalentPool> {

    /**
     * 根据公司ID查询人才库详情列表（join 简历与用户表）
     */
    List<TalentPoolDetailVO> selectDetailByCompanyId(@Param("companyId") Long companyId);
    
    /**
     * 将已逻辑删除的人才记录恢复为活跃状态
     * @param resumeId 简历ID
     * @param companyId 公司ID
     * @return 更新记录数
     */
    int updateDeletedTalentToActive(@Param("resumeId") Long resumeId, @Param("companyId") Long companyId);
}