package com.zephyr.job.service.impl;

import com.zephyr.job.domain.SysJob;
import com.zephyr.job.mapper.SysJobMapper;
import com.zephyr.job.service.SysJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SysJobServiceImpl implements SysJobService {
    private final SysJobMapper jobMapper;

    @Override public SysJob selectById(Long id) { return jobMapper.selectById(id); }
    @Override public List<SysJob> selectAll() { return jobMapper.selectAll(); }
    @Override @Transactional public SysJob create(SysJob job) { job.setStatus("0"); job.setDeleted(0); jobMapper.insert(job); return job; }
    @Override @Transactional public boolean update(SysJob job) { return jobMapper.updateById(job) > 0; }
    @Override @Transactional public boolean delete(Long id) { return jobMapper.deleteById(id) > 0; }
    @Override public boolean runOnce(Long id) { /* TODO: 立即执行一次 */ return true; }
}
