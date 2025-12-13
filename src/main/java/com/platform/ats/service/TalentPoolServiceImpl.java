package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.talentpool.TalentPool;
import com.platform.ats.entity.talentpool.vo.TalentPoolDetailVO;
import com.platform.ats.entity.talentpool.vo.TalentPoolVO;
import com.platform.ats.repository.TalentPoolRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 人才库服务实现类
 *
 * @author Administrator
 * @since 2025-12-13
 */
@Service
public class TalentPoolServiceImpl implements TalentPoolService {

    private final TalentPoolRepository talentPoolRepository;

    public TalentPoolServiceImpl(TalentPoolRepository talentPoolRepository) {
        this.talentPoolRepository = talentPoolRepository;
    }

    /**
     * 创建人才库记录
     * 
     * @param talentPool 人才库实体
     * @return 人才库视图对象
     */
    @Override
    public TalentPoolVO create(TalentPool talentPool) {
        // 先尝试恢复已逻辑删除的人才记录
        int recovered = talentPoolRepository.updateDeletedTalentToActive(
            talentPool.getResumeId(), talentPool.getCompanyId());
            
        if (recovered > 0) {
            // 恢复成功，查询并返回恢复的记录
            TalentPool exist = talentPoolRepository.selectOne(new LambdaQueryWrapper<TalentPool>()
                    .eq(TalentPool::getResumeId, talentPool.getResumeId())
                    .eq(TalentPool::getCompanyId, talentPool.getCompanyId())
                    .eq(TalentPool::getDeleteFlag, 0));
            
            // 更新标签和操作人信息
            if (exist != null) {
                exist.setTag(talentPool.getTag());
                exist.setOperatorId(talentPool.getOperatorId());
                talentPoolRepository.updateById(exist);
                return toVO(exist);
            }
        }

        // 判断是否已存在有效记录
        Long count = talentPoolRepository.selectCount(new LambdaQueryWrapper<TalentPool>()
                .eq(TalentPool::getResumeId, talentPool.getResumeId())
                .eq(TalentPool::getCompanyId, talentPool.getCompanyId())
                .eq(TalentPool::getDeleteFlag, 0));
                
        if (count != null && count > 0) {
            // 已有有效记录，抛出异常
            throw new BizException(ErrorCode.TALENT_ALREADY_EXISTS, "该简历已在人才库中");
        }

        // 插入新的人才记录
        talentPool.setTalentId(null);
        talentPool.setDeleteFlag(0);
        talentPoolRepository.insert(talentPool);
        return toVO(talentPool);
    }

    /**
     * 更新人才库记录
     * 
     * @param talentPool 人才库实体
     * @return 人才库视图对象
     */
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

    /**
     * 删除人才库记录
     * 
     * @param talentId 人才ID
     * @return 是否删除成功
     */
    @Override
    public boolean delete(Long talentId) {
        if (talentId == null) {
            return false;
        }
        // 使用逻辑删除而不是物理删除
        return talentPoolRepository.update(null, 
            new LambdaUpdateWrapper<TalentPool>()
                .set(TalentPool::getDeleteFlag, 1)
                .eq(TalentPool::getTalentId, talentId)) > 0;
    }

    /**
     * 根据ID获取人才库记录
     * 
     * @param talentId 人才ID
     * @return 人才库视图对象
     */
    @Override
    public TalentPoolVO getById(Long talentId) {
        TalentPool tp = talentPoolRepository.selectById(talentId);
        return tp == null ? null : toVO(tp);
    }

    /**
     * 根据公司ID获取人才库记录列表
     * 
     * @param companyId 公司ID
     * @return 人才库视图对象列表
     */
    @Override
    public List<TalentPoolVO> listByCompanyId(Long companyId) {
        List<TalentPool> list = talentPoolRepository.selectList(
                new LambdaQueryWrapper<TalentPool>()
                        .eq(TalentPool::getCompanyId, companyId)
                        .eq(TalentPool::getDeleteFlag, 0) // 只查询未删除的记录
                        .orderByDesc(TalentPool::getPutInTime)
        );
        return list.stream().map(this::toVO).collect(Collectors.toList());
    }

    /**
     * 根据公司ID获取人才库详情列表
     * 
     * @param companyId 公司ID
     * @return 人才库详情视图对象列表
     */
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