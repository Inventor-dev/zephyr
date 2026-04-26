package com.zephyr.system.service;

import com.zephyr.system.domain.SysOrg;
import java.util.List;

public interface SysOrgService {
    SysOrg selectById(Long id);
    List<SysOrg> selectAll();
    SysOrg create(SysOrg org);
    boolean update(SysOrg org);
    boolean delete(Long id);
}
