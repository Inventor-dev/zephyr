package com.zephyr.log.service;

import com.zephyr.log.domain.SysOperLog;
import java.util.List;

public interface SysOperLogService {
    void saveLog(SysOperLog log);
    List<SysOperLog> selectAll();
    List<SysOperLog> selectByModule(String module);
}
