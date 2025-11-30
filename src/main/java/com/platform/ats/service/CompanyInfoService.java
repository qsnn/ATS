package com.platform.ats.service;

import com.platform.ats.entity.company.CompanyInfo;
import com.platform.ats.entity.company.vo.CompanyInfoVO;

import java.util.List;

public interface CompanyInfoService {

    CompanyInfoVO create(CompanyInfo companyInfo);

    CompanyInfoVO update(CompanyInfo companyInfo);

    boolean delete(Long companyId);

    CompanyInfoVO getById(Long companyId);

    List<CompanyInfoVO> listAll();
}