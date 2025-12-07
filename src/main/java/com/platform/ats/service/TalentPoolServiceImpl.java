package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.company.TalentPool;
import com.platform.ats.entity.company.vo.TalentPoolDetailVO;
import com.platform.ats.entity.company.vo.TalentPoolVO;
import com.platform.ats.repository.TalentPoolRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TalentPoolServiceImpl implements TalentPoolService {

    private final TalentPoolRepository talentPoolRepository;

    public TalentPoolServiceImpl(TalentPoolRepository talentPoolRepository) {
        this.talentPoolRepository = talentPoolRepository;
    }

    @Override
    public TalentPoolVO create(TalentPool talentPool) {
        talentPool.setTalentId(null);
        talentPool.setDeleteFlag(null);
        talentPoolRepository.insert(talentPool);
        return toVO(talentPool);
    }

    @Override
    public TalentPoolVO update(TalentPool talentPool) {
        if (talentPool.getTalentId() == null) {
            throw new BizException(ErrorCode.TALENT_NOT_FOUND, "talentId不能为空");
        }
        talentPool.setDeleteFlag(null);
        talentPoolRepository.updateById(talentPool);
        TalentPool db = talentPoolRepository.selectById(talentPool.getTalentId());
        return db == null ? null : toVO(db);
    }

    @Override
    public boolean delete(Long talentId) {
        if (talentId == null) {
            return false;
        }
        return talentPoolRepository.deleteById(talentId) > 0;
    }

    @Override
    public TalentPoolVO getById(Long talentId) {
        TalentPool tp = talentPoolRepository.selectById(talentId);
        return tp == null ? null : toVO(tp);
    }

    @Override
    public List<TalentPoolVO> listByCompanyId(Long companyId) {
        List<TalentPool> list = talentPoolRepository.selectList(
                new LambdaQueryWrapper<TalentPool>()
                        .eq(TalentPool::getCompanyId, companyId)
                        .orderByDesc(TalentPool::getPutInTime)
        );
        return list.stream().map(this::toVO).collect(Collectors.toList());
    }

    @Override
    public List<TalentPoolDetailVO> listDetailByCompanyId(Long companyId) {
        if (companyId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "companyId不能为空");
        }
        return talentPoolRepository.selectDetailByCompanyId(companyId);
    }

    private TalentPoolVO toVO(TalentPool entity) {
        TalentPoolVO vo = new TalentPoolVO();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }
}