package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.company.CompanyInfo;
import com.platform.ats.entity.company.dto.CompanyQueryDTO;
import com.platform.ats.entity.company.vo.CompanyInfoVO;
import com.platform.ats.repository.CompanyInfoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 公司信息服务实现类
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Service
public class CompanyInfoServiceImpl extends ServiceImpl<CompanyInfoRepository, CompanyInfo> implements CompanyInfoService {

    private final CompanyInfoRepository companyInfoRepository;

    public CompanyInfoServiceImpl(CompanyInfoRepository companyInfoRepository) {
        this.companyInfoRepository = companyInfoRepository;
    }

    /**
     * 创建公司信息
     * 
     * @param companyInfo 公司信息实体
     * @return 公司信息视图对象
     */
    @Override
    public CompanyInfoVO create(CompanyInfo companyInfo) {
        companyInfo.setCompanyId(null);
        companyInfo.setDeleteFlag(null);
        // 删除了setStatus相关代码
        companyInfoRepository.insert(companyInfo);
        return toVO(companyInfo);
    }

    /**
     * 更新公司信息
     * 
     * @param companyInfo 公司信息实体
     * @return 公司信息视图对象
     */
    @Override
    public CompanyInfoVO update(CompanyInfo companyInfo) {
        if (companyInfo.getCompanyId() == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "companyId不能为空");
        }
        companyInfo.setDeleteFlag(null);
        companyInfoRepository.updateById(companyInfo);
        CompanyInfo db = companyInfoRepository.selectById(companyInfo.getCompanyId());
        return db == null ? null : toVO(db);
    }

    /**
     * 删除公司信息
     * 
     * @param companyId 公司ID
     * @return 是否删除成功
     */
    @Override
    public boolean delete(Long companyId) {
        if (companyId == null) {
            return false;
        }
        return companyInfoRepository.deleteById(companyId) > 0;
    }

    /**
     * 根据ID获取公司信息
     * 
     * @param companyId 公司ID
     * @return 公司信息视图对象
     */
    @Override
    public CompanyInfoVO getById(Long companyId) {
        CompanyInfo companyInfo = companyInfoRepository.selectById(companyId);
        return companyInfo == null ? null : toVO(companyInfo);
    }

    /**
     * 获取所有公司信息列表
     * 
     * @return 公司信息视图对象列表
     */
    @Override
    public List<CompanyInfoVO> listAll() {
        List<CompanyInfo> list = companyInfoRepository.selectList(
                new LambdaQueryWrapper<CompanyInfo>().orderByDesc(CompanyInfo::getCreateTime)
        );
        return list.stream().map(this::toVO).collect(Collectors.toList());
    }

    /**
     * 分页查询公司列表
     * 
     * @param page 分页参数
     * @param query 查询条件
     * @return 公司信息分页列表
     */
    @Override
    public IPage<CompanyInfoVO> getCompanyPage(Page<CompanyInfoVO> page, CompanyQueryDTO query) {
        LambdaQueryWrapper<CompanyInfo> queryWrapper = new LambdaQueryWrapper<>();
        
        // 模糊查询公司名称
        if (StringUtils.hasText(query.getCompanyName())) {
            queryWrapper.like(CompanyInfo::getCompanyName, query.getCompanyName());
        }
        
        // 删除了status筛选相关代码
        
        // 按创建时间倒序排列
        queryWrapper.orderByDesc(CompanyInfo::getCreateTime);
        
        // 执行分页查询，使用与queryWrapper相同的泛型类型
        Page<CompanyInfo> entityPage = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        IPage<CompanyInfo> companyPage = companyInfoRepository.selectPage(entityPage, queryWrapper);
        
        // 转换为VO对象
        Page<CompanyInfoVO> voPage = new Page<>(companyPage.getCurrent(), companyPage.getSize(), companyPage.getTotal());
        List<CompanyInfoVO> voList = companyPage.getRecords().stream().map(this::toVO).collect(Collectors.toList());
        voPage.setRecords(voList);
        
        return voPage;
    }
    
    // 删除了updateStatus方法相关代码

    private CompanyInfoVO toVO(CompanyInfo entity) {
        CompanyInfoVO vo = new CompanyInfoVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}