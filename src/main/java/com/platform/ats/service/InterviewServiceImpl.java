package com.platform.ats.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.platform.ats.entity.interview.Interview_result;
import com.platform.ats.entity.interview.Interview_address;
import com.platform.ats.entity.interview.Interview_arrange;
import com.platform.ats.entity.interview.vo.InterviewInfoVO;
import com.platform.ats.repository.Interview_addressRepository;
import com.platform.ats.repository.Interview_arrangeRepository;
import com.platform.ats.repository.Interview_resultRepository;
import com.platform.ats.entity.interview.vo.AddressVO;
import com.platform.ats.entity.interview.vo.ResultVO;
import com.platform.ats.entity.interview.vo.ArrangeVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service
public class InterviewServiceImpl implements InterviewService {

    @Autowired
    private Interview_arrangeRepository interview_arrangeRepository;

    @Autowired
    private Interview_addressRepository interview_addressRepository;

    @Autowired
    private Interview_resultRepository interview_resultRepository;

    @Override
    public Long arrangeInterview(ArrangeVO arrangeVO) {
        Interview_arrange arrange = new Interview_arrange();
        BeanUtils.copyProperties(arrangeVO, arrange);
        interview_arrangeRepository.insert(arrange);
        return arrange.getArrangeId();
    }

    @Override
    public Long setInterviewAddress(AddressVO addressVO) {
        Interview_address address = new Interview_address();
        BeanUtils.copyProperties(addressVO, address);
        interview_addressRepository.insert(address);
        return address.getAddressId();
    }

    @Override
    public void setInterviewResult(ResultVO resultVO) {
        Interview_result result = new Interview_result();
        BeanUtils.copyProperties(resultVO, result);
        interview_resultRepository.insert(result);
    }

    @Override
    public AddressVO getInterviewAddress(Long addressId) {
        Interview_address address = interview_addressRepository.selectById(addressId);
        if (address == null) {
            return null;
        }
        AddressVO addressVO = new AddressVO();
        BeanUtils.copyProperties(address, addressVO);
        return addressVO;
    }

    @Override
    public InterviewInfoVO getInterviewInfo(@PathVariable Long arrangeId) {
        Interview_arrange arrange = interview_arrangeRepository.selectById(arrangeId);
        if (arrange == null) {
            return null;
        }
        InterviewInfoVO infoVO = new InterviewInfoVO();
        ArrangeVO arrangeVO = new ArrangeVO();
        BeanUtils.copyProperties(arrange, arrangeVO);
        infoVO.setArrangeVO(arrangeVO);
        Interview_result result = interview_resultRepository.selectOne(
                new QueryWrapper<Interview_result>().eq("arrange_id", arrangeId)
        );
        if (result != null) {
            ResultVO resultVO = new ResultVO();
            BeanUtils.copyProperties(result, resultVO);
            infoVO.setResultVO(resultVO);
        }
        Interview_address address = interview_addressRepository.selectOne(
                new QueryWrapper<Interview_address>().eq("address_id", arrange.getInterviewAddressId())
        );
        if (address != null) {
            AddressVO addressVO = new AddressVO();
            BeanUtils.copyProperties(address, addressVO);
            infoVO.setAddressVO(addressVO);
        }
        return infoVO;
    }

}
