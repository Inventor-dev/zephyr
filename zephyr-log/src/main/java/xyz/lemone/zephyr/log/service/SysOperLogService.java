package xyz.lemone.zephyr.log.service;

import xyz.lemone.zephyr.log.domain.SysOperLog;
import java.util.List;

public interface SysOperLogService {
    void saveLog(SysOperLog log);
    List<SysOperLog> selectAll();
    List<SysOperLog> selectByModule(String module);
}
