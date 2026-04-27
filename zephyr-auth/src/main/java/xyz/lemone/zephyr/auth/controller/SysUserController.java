package xyz.lemone.zephyr.auth.controller;

import xyz.lemone.zephyr.auth.domain.SysUser;
import xyz.lemone.zephyr.auth.service.SysUserService;
import xyz.lemone.zephyr.common.core.domain.PageQuery;
import xyz.lemone.zephyr.common.core.domain.PageResult;
import xyz.lemone.zephyr.common.core.domain.R;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户管理接口
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class SysUserController {

    private final SysUserService userService;

    @GetMapping("/{id}")
    public R<SysUser> getById(@PathVariable Long id) {
        return R.ok(userService.selectById(id));
    }

    @GetMapping("/page")
    public R<PageResult<SysUser>> page(PageQuery query) {
        return R.ok(userService.selectPage(query));
    }

    @PostMapping
    public R<SysUser> create(@RequestBody SysUser user) {
        return R.ok(userService.create(user));
    }

    @PutMapping
    public R<Boolean> update(@RequestBody SysUser user) {
        return R.ok(userService.update(user));
    }

    @DeleteMapping("/{id}")
    public R<Boolean> delete(@PathVariable Long id) {
        return R.ok(userService.delete(id));
    }

    @PostMapping("/{id}/reset-password")
    public R<Boolean> resetPassword(@PathVariable Long id, @RequestParam String newPassword) {
        return R.ok(userService.resetPassword(id, newPassword));
    }

    @PostMapping("/{id}/roles")
    public R<Boolean> assignRoles(@PathVariable Long id, @RequestBody List<Long> roleIds) {
        return R.ok(userService.assignRoles(id, roleIds));
    }
}
