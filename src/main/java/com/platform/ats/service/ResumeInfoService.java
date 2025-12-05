package com.platform.ats.service;

import com.platform.ats.entity.resume.dto.ResumeInfoDTO;
import com.platform.ats.entity.resume.vo.ResumeInfoVo;

import java.util.List;

public interface ResumeInfoService {

    ResumeInfoVo create(ResumeInfoDTO resumeInfoDTO);

    ResumeInfoVo update(ResumeInfoDTO resumeInfoDTO);

    boolean delete(Long resumeId);

    ResumeInfoDTO getById(Long resumeId);

    List<ResumeInfoDTO> listAll();

    List<ResumeInfoDTO> listByUserId(Long userId);

}

