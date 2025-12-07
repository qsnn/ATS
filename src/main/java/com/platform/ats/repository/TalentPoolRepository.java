package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.platform.ats.entity.company.TalentPool;
import com.platform.ats.entity.company.vo.TalentPoolDetailVO;
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
}