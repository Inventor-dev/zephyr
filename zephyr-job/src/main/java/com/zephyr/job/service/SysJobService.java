package com.zephyr.job.service;

import com.zephyr.job.domain.SysJob;
import java.util.List;

public interface SysJobService {
    SysJob selectById(Long id);
    List<SysJob> selectAll();
    SysJob create(SysJob job);
    boolean update(SysJob job);
    boolean delete(Long id);
    boolean runOnce(Long id);
}
