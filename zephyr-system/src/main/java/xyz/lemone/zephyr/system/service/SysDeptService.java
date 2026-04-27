package xyz.lemone.zephyr.system.service;

import xyz.lemone.zephyr.system.domain.SysDept;
import java.util.List;

public interface SysDeptService {
    SysDept selectById(Long id);
    List<SysDept> selectAll();
    List<SysDept> selectByOrgId(Long orgId);
    SysDept create(SysDept dept);
    boolean update(SysDept dept);
    boolean delete(Long id);
}
