package xyz.lemone.zephyr.system.controller;

import xyz.lemone.zephyr.common.core.domain.R;
import xyz.lemone.zephyr.system.domain.SysDept;
import xyz.lemone.zephyr.system.service.SysDeptService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dept")
@RequiredArgsConstructor
public class SysDeptController {

    private final SysDeptService deptService;

    @GetMapping("/{id}")
    public R<SysDept> getById(@PathVariable Long id) { return R.ok(deptService.selectById(id)); }

    @GetMapping("/list")
    public R<List<SysDept>> list() { return R.ok(deptService.selectAll()); }

    @GetMapping("/org/{orgId}")
    public R<List<SysDept>> getByOrgId(@PathVariable Long orgId) { return R.ok(deptService.selectByOrgId(orgId)); }

    @PostMapping
    public R<SysDept> create(@RequestBody SysDept dept) { return R.ok(deptService.create(dept)); }

    @PutMapping
    public R<Boolean> update(@RequestBody SysDept dept) { return R.ok(deptService.update(dept)); }

    @DeleteMapping("/{id}")
    public R<Boolean> delete(@PathVariable Long id) { return R.ok(deptService.delete(id)); }
}
