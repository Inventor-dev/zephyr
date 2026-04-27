package xyz.lemone.zephyr.log.service.impl;

import xyz.lemone.zephyr.log.domain.SysOperLog;
import xyz.lemone.zephyr.log.mapper.SysOperLogMapper;
import xyz.lemone.zephyr.log.service.SysOperLogService;
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
