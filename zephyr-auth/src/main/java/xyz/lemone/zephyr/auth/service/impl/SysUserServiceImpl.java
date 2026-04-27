package xyz.lemone.zephyr.auth.service.impl;

import xyz.lemone.zephyr.auth.domain.SysUser;
import xyz.lemone.zephyr.auth.domain.SysUserRole;
import xyz.lemone.zephyr.auth.mapper.SysUserMapper;
import xyz.lemone.zephyr.auth.mapper.SysUserRoleMapper;
import xyz.lemone.zephyr.auth.service.SysUserService;
import xyz.lemone.zephyr.common.core.domain.PageQuery;
import xyz.lemone.zephyr.common.core.domain.PageResult;
import xyz.lemone.zephyr.common.core.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 用户管理实现
 */
@Service
@RequiredArgsConstructor
public class SysUserServiceImpl implements SysUserService {

    private final SysUserMapper userMapper;
    private final SysUserRoleMapper userRoleMapper;

    @Override
    public SysUser selectById(Long id) {
        SysUser user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException("USER_NOT_FOUND", "用户不存在");
        }
        return user;
    }

    @Override
    public SysUser selectByUsername(String username) {
        return userMapper.selectByUsername(username);
    }

    @Override
    public PageResult<SysUser> selectPage(PageQuery query) {
        List<SysUser> list = userMapper.selectAll();
        // TODO: 分页逻辑
        return PageResult.of(list, list.size(), query.getPage(), query.getPageSize());
    }

    @Override
    @Transactional
    public SysUser create(SysUser user) {
        // 检查用户名是否已存在
        if (selectByUsername(user.getUsername()) != null) {
            throw new BusinessException("USER_EXISTS", "用户名已存在");
        }
        user.setStatus("1");
        user.setDeleted(0);
        // TODO: 密码加密
        userMapper.insert(user);
        return user;
    }

    @Override
    @Transactional
    public boolean update(SysUser user) {
        return userMapper.updateById(user) > 0;
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return userMapper.deleteById(id) > 0;
    }

    @Override
    @Transactional
    public boolean resetPassword(Long id, String newPassword) {
        SysUser user = new SysUser();
        user.setId(id);
        // TODO: 密码加密
        user.setPassword(newPassword);
        return userMapper.updateById(user) > 0;
    }

    @Override
    @Transactional
    public boolean assignRoles(Long userId, List<Long> roleIds) {
        userRoleMapper.deleteByUserId(userId);
        for (Long roleId : roleIds) {
            SysUserRole userRole = new SysUserRole();
            userRole.setUserId(userId);
            userRole.setRoleId(roleId);
            userRoleMapper.insert(userRole);
        }
        return true;
    }
}
