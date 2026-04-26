package com.zephyr.monitor.controller;

import com.zephyr.common.core.domain.R;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.OperatingSystemMXBean;
import java.lang.management.RuntimeMXBean;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/monitor")
public class MonitorController {

    @GetMapping("/info")
    public R<Map<String, Object>> info() {
        RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();
        MemoryMXBean memory = ManagementFactory.getMemoryMXBean();
        OperatingSystemMXBean os = ManagementFactory.getOperatingSystemMXBean();

        Map<String, Object> info = new LinkedHashMap<>();
        info.put("javaVersion", System.getProperty("java.version"));
        info.put("javaHome", System.getProperty("java.home"));
        info.put("osName", os.getName());
        info.put("osArch", os.getArch());
        info.put("availableProcessors", os.getAvailableProcessors());
        info.put("uptimeHours", runtime.getUptime() / 3600000);
        info.put("maxMemoryMB", runtime.maxMemory() / 1048576);
        info.put("totalMemoryMB", runtime.totalMemory() / 1048576);
        info.put("freeMemoryMB", runtime.freeMemory() / 1048576);
        info.put("usedMemoryMB", (runtime.totalMemory() - runtime.freeMemory()) / 1048576);
        return R.ok(info);
    }
}
