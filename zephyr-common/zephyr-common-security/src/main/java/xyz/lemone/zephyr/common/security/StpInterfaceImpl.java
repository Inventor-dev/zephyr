package xyz.lemone.zephyr.common.security;

import cn.dev33.satoken.stp.StpInterface;
import xyz.lemone.zephyr.common.redis.RedisUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Sa-Token 权限认证实现
 */
@Component
@RequiredArgsConstructor
public class StpInterfaceImpl implements StpInterface {

    private final RedisUtils redisUtils;

    private static final String PERM_PREFIX = "zephyr:perm:";
    private static final String ROLE_PREFIX = "zephyr:role:";

    /**
     * 返回一个账号所拥有的权限码集合
     */
    @Override
    public List<String> getPermissionList(Object loginId, String loginType) {
        String key = PERM_PREFIX + loginId;
        List<String> perms = new ArrayList<>(redisUtils.setMembers(key));
        // 超级管理员拥有所有权限
        if (perms.contains("*")) {
            perms.add("*:*:*");
        }
        return perms;
    }

    /**
     * 返回一个账号所拥有的角色标识集合
     */
    @Override
    public List<String> getRoleList(Object loginId, String loginType) {
        String key = ROLE_PREFIX + loginId;
        return new ArrayList<>(redisUtils.setMembers(key));
    }
}
