package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.platform.ats.common.BizException;
import com.platform.ats.common.ErrorCode;
import com.platform.ats.entity.resume.ResumeInfo;
import com.platform.ats.entity.resume.dto.ResumeInfoDTO;
import com.platform.ats.entity.resume.vo.ResumeInfoVo;
import com.platform.ats.repository.ResumeInfoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeInfoServiceImpl implements ResumeInfoService {

    private final ResumeInfoRepository resumeInfoRepository;
    public ResumeInfoServiceImpl(ResumeInfoRepository resumeInfoRepository) {
        this.resumeInfoRepository = resumeInfoRepository;
    }

    @Override
    public ResumeInfoVo create(ResumeInfoDTO resumeInfoDTO) {
        ResumeInfo resumeInfo = new ResumeInfo();
        BeanUtils.copyProperties(resumeInfoDTO, resumeInfo);
        resumeInfo.setResumeId(null);
        resumeInfo.setCreateTime(LocalDateTime.now());
        resumeInfo.setUpdateTime(LocalDateTime.now());
        resumeInfo.setDeleteFlag(0);

        resumeInfoRepository.insert(resumeInfo);

        ResumeInfoVo resumeInfoVo = new ResumeInfoVo();
        resumeInfoVo.setResumeId(resumeInfo.getResumeId());
        return resumeInfoVo;
    }

    @Override
    public ResumeInfoVo update(ResumeInfoDTO resumeInfoDTO) {
        if (resumeInfoDTO.getResumeId() == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "resumeId不能为空");
        }

        ResumeInfo resumeInfo = resumeInfoRepository.selectById(resumeInfoDTO.getResumeId());
        if (resumeInfo == null) {
            throw new BizException(ErrorCode.RESUME_NOT_FOUND, "简历不存在");
        }

        BeanUtils.copyProperties(resumeInfoDTO, resumeInfo);
        resumeInfo.setUpdateTime(LocalDateTime.now());

        resumeInfoRepository.updateById(resumeInfo);

        ResumeInfoVo resumeInfoVo = new ResumeInfoVo();
        resumeInfoVo.setResumeId(resumeInfo.getResumeId());
        return resumeInfoVo;
    }

    @Override
    @Transactional  // 添加事务注解
    public boolean delete(Long resumeId) {
        if (resumeId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "resumeId不能为空");
        }

        // 方法1：使用 UpdateWrapper（推荐）
        UpdateWrapper<ResumeInfo> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("resume_id", resumeId)
                .set("delete_flag", 1);

        System.out.println("使用 UpdateWrapper 更新");
        int result = resumeInfoRepository.update(null, updateWrapper);
        System.out.println("UpdateWrapper 更新结果: " + result);

        if (result == 0) {
            throw new BizException(ErrorCode.RESUME_NOT_FOUND, "简历不存在或更新失败");
        }

        return true;
    }

    @Override
    public ResumeInfoDTO getById(Long resumeId) {
        ResumeInfo resumeInfo = resumeInfoRepository.selectById(resumeId);
        if (resumeInfo == null) {
            throw new BizException(ErrorCode.RESUME_NOT_FOUND, "简历不存在");
        }

        ResumeInfoDTO resumeInfoDTO = new ResumeInfoDTO();
        BeanUtils.copyProperties(resumeInfo, resumeInfoDTO);
        return resumeInfoDTO;
    }

    @Override
    public List<ResumeInfoDTO> listAll() {
        List<ResumeInfo> list = resumeInfoRepository.selectList(
                new LambdaQueryWrapper<ResumeInfo>().orderByDesc(ResumeInfo::getCreateTime)
        );
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ResumeInfoDTO> listByUserId(Long userId) {
        if (userId == null) {
            throw new BizException(ErrorCode.PARAM_MISSING, "userId不能为空");
        }
        List<ResumeInfo> list = resumeInfoRepository.selectList(
                new LambdaQueryWrapper<ResumeInfo>()
                        .eq(ResumeInfo::getUserId, userId)
                        .eq(ResumeInfo::getDeleteFlag, 0)
                        .orderByDesc(ResumeInfo::getCreateTime)
        );
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }


    private ResumeInfoDTO toDTO(ResumeInfo entity) {
        ResumeInfoDTO dto = new ResumeInfoDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
}
