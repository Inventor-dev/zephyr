package xyz.lemone.zephyr.log.controller;

import xyz.lemone.zephyr.common.core.domain.R;
import xyz.lemone.zephyr.log.domain.SysOperLog;
import xyz.lemone.zephyr.log.service.SysOperLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/log")
@RequiredArgsConstructor
public class SysOperLogController {
    private final SysOperLogService logService;

    @GetMapping("/list") public R<List<SysOperLog>> list() { return R.ok(logService.selectAll()); }
    @GetMapping("/module/{module}") public R<List<SysOperLog>> byModule(@PathVariable String module) { return R.ok(logService.selectByModule(module)); }
}
