package com.zephyr.permission.service.impl;

import com.zephyr.common.core.exception.BusinessException;
import com.zephyr.permission.domain.SysMenu;
import com.zephyr.permission.mapper.SysMenuMapper;
import com.zephyr.permission.service.SysMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SysMenuServiceImpl implements SysMenuService {

    private final SysMenuMapper menuMapper;

    @Override
    public SysMenu selectById(Long id) {
        SysMenu menu = menuMapper.selectById(id);
        if (menu == null) {
            throw new BusinessException("MENU_NOT_FOUND", "菜单不存在");
        }
        return menu;
    }

    @Override
    public List<SysMenu> selectAll() {
        return menuMapper.selectAll();
    }

    @Override
    public List<SysMenu> selectByRoleId(Long roleId) {
        return menuMapper.selectByRoleId(roleId);
    }

    @Override
    @Transactional
    public SysMenu create(SysMenu menu) {
        menu.setStatus("1");
        menu.setDeleted(0);
        menuMapper.insert(menu);
        return menu;
    }

    @Override
    @Transactional
    public boolean update(SysMenu menu) {
        return menuMapper.updateById(menu) > 0;
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return menuMapper.deleteById(id) > 0;
    }
}
