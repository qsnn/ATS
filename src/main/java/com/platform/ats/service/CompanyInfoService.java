package com.platform.ats.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.platform.ats.entity.company.CompanyInfo;
import com.platform.ats.entity.company.dto.CompanyQueryDTO;
import com.platform.ats.entity.company.vo.CompanyInfoVO;

import java.util.List;

public interface CompanyInfoService {

    CompanyInfoVO create(CompanyInfo companyInfo);

    CompanyInfoVO update(CompanyInfo companyInfo);

    boolean delete(Long companyId);

    CompanyInfoVO getById(Long companyId);

    List<CompanyInfoVO> listAll();
    
    /**
     * 分页查询公司列表
     * @param page 分页参数
     * @param query 查询条件
     * @return 公司信息分页列表
     */
    IPage<CompanyInfoVO> getCompanyPage(Page<CompanyInfoVO> page, CompanyQueryDTO query);
    
    // 删除了updateStatus方法相关代码
}