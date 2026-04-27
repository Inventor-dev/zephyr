package xyz.lemone.zephyr.auth.service;

import xyz.lemone.zephyr.auth.domain.SysUser;
import xyz.lemone.zephyr.common.core.domain.PageQuery;
import xyz.lemone.zephyr.common.core.domain.PageResult;

import java.util.List;

/**
 * 用户管理接口
 */
public interface SysUserService {

    /**
     * 根据 ID 查询
     */
    SysUser selectById(Long id);

    /**
     * 根据用户名查询
     */
    SysUser selectByUsername(String username);

    /**
     * 分页查询
     */
    PageResult<SysUser> selectPage(PageQuery query);

    /**
     * 新增用户
     */
    SysUser create(SysUser user);

    /**
     * 更新用户
     */
    boolean update(SysUser user);

    /**
     * 删除用户（逻辑删除）
     */
    boolean delete(Long id);

    /**
     * 重置密码
     */
    boolean resetPassword(Long id, String newPassword);

    /**
     * 分配角色
     */
    boolean assignRoles(Long userId, List<Long> roleIds);
}
