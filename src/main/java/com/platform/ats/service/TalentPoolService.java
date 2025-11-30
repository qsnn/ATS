// language: java
package com.platform.ats.service;

import com.platform.ats.entity.company.TalentPool;
import com.platform.ats.entity.company.vo.TalentPoolVO;

import java.util.List;

public interface TalentPoolService {

    TalentPoolVO create(TalentPool talentPool);

    TalentPoolVO update(TalentPool talentPool);

    boolean delete(Long talentId);

    TalentPoolVO getById(Long talentId);

    List<TalentPoolVO> listByCompanyId(Long companyId);
}