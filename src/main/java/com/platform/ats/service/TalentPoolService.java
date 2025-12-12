// language: java
package com.platform.ats.service;

import com.platform.ats.entity.talentpool.TalentPool;
import com.platform.ats.entity.talentpool.vo.TalentPoolVO;
import com.platform.ats.entity.talentpool.vo.TalentPoolDetailVO;

import java.util.List;

public interface TalentPoolService {

    TalentPoolVO create(TalentPool talentPool);

    TalentPoolVO update(TalentPool talentPool);

    boolean delete(Long talentId);

    TalentPoolVO getById(Long talentId);

    /**
     * 原始列表，仅包含人才库基础字段
     */
    List<TalentPoolVO> listByCompanyId(Long companyId);

    /**
     * 富列表：包含候选人姓名、职位意向、电话、邮箱等
     */
    List<TalentPoolDetailVO> listDetailByCompanyId(Long companyId);
}