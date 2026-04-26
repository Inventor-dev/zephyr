package com.zephyr.permission.controller;

import com.zephyr.common.core.domain.R;
import com.zephyr.permission.domain.SysRole;
import com.zephyr.permission.service.SysRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role")
@RequiredArgsConstructor
public class SysRoleController {

    private final SysRoleService roleService;

    @GetMapping("/{id}")
    public R<SysRole> getById(@PathVariable Long id) {
        return R.ok(roleService.selectById(id));
    }

    @GetMapping("/list")
    public R<List<SysRole>> list() {
        return R.ok(roleService.selectAll());
    }

    @PostMapping
    public R<SysRole> create(@RequestBody SysRole role) {
        return R.ok(roleService.create(role));
    }

    @PutMapping
    public R<Boolean> update(@RequestBody SysRole role) {
        return R.ok(roleService.update(role));
    }

    @DeleteMapping("/{id}")
    public R<Boolean> delete(@PathVariable Long id) {
        return R.ok(roleService.delete(id));
    }

    @PostMapping("/{id}/menus")
    public R<Boolean> assignMenus(@PathVariable Long id, @RequestBody List<Long> menuIds) {
        return R.ok(roleService.assignMenus(id, menuIds));
    }
}
