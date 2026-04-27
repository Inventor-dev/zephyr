package xyz.lemone.zephyr.system.service.impl;

import xyz.lemone.zephyr.common.core.exception.BusinessException;
import xyz.lemone.zephyr.system.domain.SysOrg;
import xyz.lemone.zephyr.system.mapper.SysOrgMapper;
import xyz.lemone.zephyr.system.service.SysOrgService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SysOrgServiceImpl implements SysOrgService {

    private final SysOrgMapper orgMapper;

    @Override
    public SysOrg selectById(Long id) {
        SysOrg org = orgMapper.selectById(id);
        if (org == null) throw new BusinessException("ORG_NOT_FOUND", "组织不存在");
        return org;
    }

    @Override
    public List<SysOrg> selectAll() { return orgMapper.selectAll(); }

    @Override
    @Transactional
    public SysOrg create(SysOrg org) {
        org.setStatus("1");
        org.setDeleted(0);
        orgMapper.insert(org);
        return org;
    }

    @Override
    @Transactional
    public boolean update(SysOrg org) { return orgMapper.updateById(org) > 0; }

    @Override
    @Transactional
    public boolean delete(Long id) { return orgMapper.deleteById(id) > 0; }
}
