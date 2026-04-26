package com.zephyr.permission.service;

import com.zephyr.permission.domain.SysMenu;
import java.util.List;

/**
 * 菜单管理接口
 */
public interface SysMenuService {

    SysMenu selectById(Long id);

    List<SysMenu> selectAll();

    List<SysMenu> selectByRoleId(Long roleId);

    SysMenu create(SysMenu menu);

    boolean update(SysMenu menu);

    boolean delete(Long id);
}
