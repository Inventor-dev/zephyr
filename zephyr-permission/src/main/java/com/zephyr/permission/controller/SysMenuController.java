package com.zephyr.permission.controller;

import com.zephyr.common.core.domain.R;
import com.zephyr.permission.domain.SysMenu;
import com.zephyr.permission.service.SysMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class SysMenuController {

    private final SysMenuService menuService;

    @GetMapping("/{id}")
    public R<SysMenu> getById(@PathVariable Long id) {
        return R.ok(menuService.selectById(id));
    }

    @GetMapping("/list")
    public R<List<SysMenu>> list() {
        return R.ok(menuService.selectAll());
    }

    @GetMapping("/role/{roleId}")
    public R<List<SysMenu>> getByRoleId(@PathVariable Long roleId) {
        return R.ok(menuService.selectByRoleId(roleId));
    }

    @PostMapping
    public R<SysMenu> create(@RequestBody SysMenu menu) {
        return R.ok(menuService.create(menu));
    }

    @PutMapping
    public R<Boolean> update(@RequestBody SysMenu menu) {
        return R.ok(menuService.update(menu));
    }

    @DeleteMapping("/{id}")
    public R<Boolean> delete(@PathVariable Long id) {
        return R.ok(menuService.delete(id));
    }
}
