package com.platform.ats.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.platform.ats.entity.log.SysOperationLog;
import org.apache.ibatis.annotations.Mapper;

/**
 * 操作日志数据访问层
 */
@Mapper
public interface LogRepository extends BaseMapper<SysOperationLog> {
}