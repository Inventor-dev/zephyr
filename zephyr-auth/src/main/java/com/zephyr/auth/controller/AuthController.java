package com.zephyr.auth.controller;

import cn.dev33.satoken.stp.SaTokenInfo;
import cn.dev33.satoken.stp.StpUtil;
import com.zephyr.auth.domain.SysUser;
import com.zephyr.auth.service.SysUserService;
import com.zephyr.common.core.domain.R;
import com.zephyr.common.core.exception.BusinessException;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 认证接口
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final SysUserService userService;

    /**
     * 登录
     */
    @PostMapping("/login")
    public R<SaTokenInfo> login(@RequestBody LoginRequest request) {
        SysUser user = userService.selectByUsername(request.getUsername());
        if (user == null) {
            throw new BusinessException("AUTH_FAILED", "用户名或密码错误");
        }
        if (!"1".equals(user.getStatus())) {
            throw new BusinessException("USER_DISABLED", "用户已被禁用");
        }
        // TODO: 密码校验（BCrypt）
        StpUtil.login(user.getId());
        SaTokenInfo tokenInfo = StpUtil.getTokenInfo();
        return R.ok(tokenInfo);
    }

    /**
     * 退出登录
     */
    @PostMapping("/logout")
    public R<Boolean> logout() {
        StpUtil.logout();
        return R.ok(true);
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/info")
    public R<SysUser> info() {
        Long userId = StpUtil.getLoginIdAsLong();
        return R.ok(userService.selectById(userId));
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }
}
