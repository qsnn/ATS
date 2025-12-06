package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.company.CompanyInfo;
import com.platform.ats.entity.company.vo.CompanyInfoVO;
import com.platform.ats.repository.CompanyInfoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyInfoServiceImpl implements CompanyInfoService {

    private final CompanyInfoRepository companyInfoRepository;

    public CompanyInfoServiceImpl(CompanyInfoRepository companyInfoRepository) {
        this.companyInfoRepository = companyInfoRepository;
    }

    @Override
    public CompanyInfoVO create(CompanyInfo companyInfo) {
        companyInfo.setCompanyId(null);
        companyInfo.setDeleteFlag(null);
        companyInfoRepository.insert(companyInfo);
        return toVO(companyInfo);
    }

    @Override
    public CompanyInfoVO update(CompanyInfo companyInfo) {
        if (companyInfo.getCompanyId() == null) {
            throw new BizException(ErrorCode.BAD_REQUEST, "companyId不能为空");
        }
        companyInfo.setDeleteFlag(null);
        companyInfoRepository.updateById(companyInfo);
        CompanyInfo db = companyInfoRepository.selectById(companyInfo.getCompanyId());
        return db == null ? null : toVO(db);
    }

    @Override
    public boolean delete(Long companyId) {
        if (companyId == null) {
            return false;
        }
        return companyInfoRepository.deleteById(companyId) > 0;
    }

    @Override
    public CompanyInfoVO getById(Long companyId) {
        CompanyInfo companyInfo = companyInfoRepository.selectById(companyId);
        return companyInfo == null ? null : toVO(companyInfo);
    }

    @Override
    public List<CompanyInfoVO> listAll() {
        List<CompanyInfo> list = companyInfoRepository.selectList(
                new LambdaQueryWrapper<CompanyInfo>().orderByDesc(CompanyInfo::getCreateTime)
        );
        return list.stream().map(this::toVO).collect(Collectors.toList());
    }

    private CompanyInfoVO toVO(CompanyInfo entity) {
        CompanyInfoVO vo = new CompanyInfoVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}