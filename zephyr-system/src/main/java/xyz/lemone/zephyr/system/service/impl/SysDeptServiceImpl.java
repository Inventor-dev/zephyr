package xyz.lemone.zephyr.system.service.impl;

import xyz.lemone.zephyr.common.core.exception.BusinessException;
import xyz.lemone.zephyr.system.domain.SysDept;
import xyz.lemone.zephyr.system.mapper.SysDeptMapper;
import xyz.lemone.zephyr.system.service.SysDeptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SysDeptServiceImpl implements SysDeptService {

    private final SysDeptMapper deptMapper;

    @Override
    public SysDept selectById(Long id) {
        SysDept dept = deptMapper.selectById(id);
        if (dept == null) throw new BusinessException("DEPT_NOT_FOUND", "部门不存在");
        return dept;
    }

    @Override
    public List<SysDept> selectAll() { return deptMapper.selectAll(); }

    @Override
    public List<SysDept> selectByOrgId(Long orgId) { return deptMapper.selectByOrgId(orgId); }

    @Override
    @Transactional
    public SysDept create(SysDept dept) {
        dept.setStatus("1");
        dept.setDeleted(0);
        deptMapper.insert(dept);
        return dept;
    }

    @Override
    @Transactional
    public boolean update(SysDept dept) { return deptMapper.updateById(dept) > 0; }

    @Override
    @Transactional
    public boolean delete(Long id) { return deptMapper.deleteById(id) > 0; }
}
