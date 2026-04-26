package com.zephyr.job.controller;

import com.zephyr.common.core.domain.R;
import com.zephyr.job.domain.SysJob;
import com.zephyr.job.service.SysJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/job")
@RequiredArgsConstructor
public class SysJobController {
    private final SysJobService jobService;

    @GetMapping("/{id}") public R<SysJob> getById(@PathVariable Long id) { return R.ok(jobService.selectById(id)); }
    @GetMapping("/list") public R<List<SysJob>> list() { return R.ok(jobService.selectAll()); }
    @PostMapping public R<SysJob> create(@RequestBody SysJob job) { return R.ok(jobService.create(job)); }
    @PutMapping public R<Boolean> update(@RequestBody SysJob job) { return R.ok(jobService.update(job)); }
    @DeleteMapping("/{id}") public R<Boolean> delete(@PathVariable Long id) { return R.ok(jobService.delete(id)); }
    @PostMapping("/{id}/run") public R<Boolean> runOnce(@PathVariable Long id) { return R.ok(jobService.runOnce(id)); }
}
