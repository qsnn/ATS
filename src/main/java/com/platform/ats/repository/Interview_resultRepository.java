package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.platform.ats.entity.interview.Interview_result;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface Interview_resultRepository extends BaseMapper<Interview_result> {
    // 自定义查询方法可以在这里定义
}
