package xyz.lemone.zephyr.permission.service;

import xyz.lemone.zephyr.permission.domain.SysRole;
import java.util.List;

/**
 * 角色管理接口
 */
public interface SysRoleService {

    SysRole selectById(Long id);

    List<SysRole> selectAll();

    SysRole create(SysRole role);

    boolean update(SysRole role);

    boolean delete(Long id);

    boolean assignMenus(Long roleId, List<Long> menuIds);
}
