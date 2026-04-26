package com.zephyr.permission.service.impl;

import com.zephyr.common.core.exception.BusinessException;
import com.zephyr.permission.domain.SysRole;
import com.zephyr.permission.domain.SysRoleMenu;
import com.zephyr.permission.mapper.SysRoleMapper;
import com.zephyr.permission.mapper.SysRoleMenuMapper;
import com.zephyr.permission.service.SysRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SysRoleServiceImpl implements SysRoleService {

    private final SysRoleMapper roleMapper;
    private final SysRoleMenuMapper roleMenuMapper;

    @Override
    public SysRole selectById(Long id) {
        SysRole role = roleMapper.selectById(id);
        if (role == null) {
            throw new BusinessException("ROLE_NOT_FOUND", "角色不存在");
        }
        return role;
    }

    @Override
    public List<SysRole> selectAll() {
        return roleMapper.selectAll();
    }

    @Override
    @Transactional
    public SysRole create(SysRole role) {
        role.setStatus("1");
        role.setDeleted(0);
        roleMapper.insert(role);
        return role;
    }

    @Override
    @Transactional
    public boolean update(SysRole role) {
        return roleMapper.updateById(role) > 0;
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return roleMapper.deleteById(id) > 0;
    }

    @Override
    @Transactional
    public boolean assignMenus(Long roleId, List<Long> menuIds) {
        roleMenuMapper.deleteByRoleId(roleId);
        for (Long menuId : menuIds) {
            SysRoleMenu rm = new SysRoleMenu();
            rm.setRoleId(roleId);
            rm.setMenuId(menuId);
            roleMenuMapper.insert(rm);
        }
        return true;
    }
}
