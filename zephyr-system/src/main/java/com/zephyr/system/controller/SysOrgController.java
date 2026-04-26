package com.zephyr.system.controller;

import com.zephyr.common.core.domain.R;
import com.zephyr.system.domain.SysOrg;
import com.zephyr.system.service.SysOrgService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/org")
@RequiredArgsConstructor
public class SysOrgController {

    private final SysOrgService orgService;

    @GetMapping("/{id}")
    public R<SysOrg> getById(@PathVariable Long id) { return R.ok(orgService.selectById(id)); }

    @GetMapping("/list")
    public R<List<SysOrg>> list() { return R.ok(orgService.selectAll()); }

    @PostMapping
    public R<SysOrg> create(@RequestBody SysOrg org) { return R.ok(orgService.create(org)); }

    @PutMapping
    public R<Boolean> update(@RequestBody SysOrg org) { return R.ok(orgService.update(org)); }

    @DeleteMapping("/{id}")
    public R<Boolean> delete(@PathVariable Long id) { return R.ok(orgService.delete(id)); }
}
