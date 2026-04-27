package xyz.lemone.zephyr.common.security;

import cn.dev33.satoken.stp.StpUtil;
import xyz.lemone.zephyr.common.core.exception.BusinessException;

/**
 * 安全工具类
 */
public class SecurityUtils {

    /**
     * 获取当前登录用户 ID
     */
    public static Long getUserId() {
        try {
            return StpUtil.getLoginIdAsLong();
        } catch (Exception e) {
            throw new BusinessException("UNAUTHORIZED", "未登录或登录已过期");
        }
    }

    /**
     * 获取当前登录用户名
     */
    public static String getUsername() {
        try {
            return StpUtil.getLoginIdAsString();
        } catch (Exception e) {
            throw new BusinessException("UNAUTHORIZED", "未登录或登录已过期");
        }
    }

    /**
     * 检查是否已登录
     */
    public static boolean isLogin() {
        return StpUtil.isLogin();
    }

    /**
     * 检查是否有指定权限
     */
    public static boolean hasPermission(String permission) {
        return StpUtil.hasPermission(permission);
    }

    /**
     * 检查是否有指定角色
     */
    public static boolean hasRole(String role) {
        return StpUtil.hasRole(role);
    }

    /**
     * 校验权限（无权限抛异常）
     */
    public static void checkPermission(String permission) {
        StpUtil.checkPermission(permission);
    }

    /**
     * 校验角色（无角色抛异常）
     */
    public static void checkRole(String role) {
        StpUtil.checkRole(role);
    }
}
