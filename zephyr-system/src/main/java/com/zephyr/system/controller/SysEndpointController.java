package com.zephyr.system.controller;

import com.zephyr.common.core.domain.R;
import com.zephyr.system.domain.SysEndpoint;
import com.zephyr.system.service.SysEndpointService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/endpoint")
@RequiredArgsConstructor
public class SysEndpointController {

    private final SysEndpointService endpointService;

    @GetMapping("/{id}")
    public R<SysEndpoint> getById(@PathVariable Long id) { return R.ok(endpointService.selectById(id)); }

    @GetMapping("/code/{appCode}")
    public R<SysEndpoint> getByAppCode(@PathVariable String appCode) { return R.ok(endpointService.selectByAppCode(appCode)); }

    @GetMapping("/list")
    public R<List<SysEndpoint>> list() { return R.ok(endpointService.selectAll()); }

    @PostMapping
    public R<SysEndpoint> create(@RequestBody SysEndpoint endpoint) { return R.ok(endpointService.create(endpoint)); }

    @PutMapping
    public R<Boolean> update(@RequestBody SysEndpoint endpoint) { return R.ok(endpointService.update(endpoint)); }

    @DeleteMapping("/{id}")
    public R<Boolean> delete(@PathVariable Long id) { return R.ok(endpointService.delete(id)); }
}
