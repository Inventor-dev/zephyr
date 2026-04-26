package com.zephyr.log.service.impl;

import com.zephyr.log.domain.SysOperLog;
import com.zephyr.log.mapper.SysOperLogMapper;
import com.zephyr.log.service.SysOperLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SysOperLogServiceImpl implements SysOperLogService {
    private final SysOperLogMapper logMapper;
    @Override public void saveLog(SysOperLog log) { logMapper.insert(log); }
    @Override public List<SysOperLog> selectAll() { return logMapper.selectAll(); }
    @Override public List<SysOperLog> selectByModule(String module) { return logMapper.selectByModule(module); }
}
