package com.platform.ats.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.platform.ats.entity.log.SysOperationLog;
import com.platform.ats.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 操作日志服务实现类
 */
@Service
@RequiredArgsConstructor
public class LogServiceImpl extends ServiceImpl<LogRepository, SysOperationLog> implements LogService {
}