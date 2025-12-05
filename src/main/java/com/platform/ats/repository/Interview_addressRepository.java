package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.platform.ats.entity.interview.Interview_address;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface Interview_addressRepository extends BaseMapper<Interview_address> {
    // 自定义查询方法可以在这里定义
}
