package com.zephyr.plugin.core;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 插件管理接口
 */
@RestController
@RequestMapping("/api/plugin")
@RequiredArgsConstructor
public class PluginController {

    private final PluginRegistry registry;

    /**
     * 获取所有插件列表
     */
    @GetMapping("/list")
    public List<PluginMeta> list() {
        return registry.listAll();
    }

    /**
     * 获取运行中的插件
     */
    @GetMapping("/running")
    public List<PluginMeta> running() {
        return registry.listRunning();
    }

    /**
     * 获取插件详情
     */
    @GetMapping("/{pluginId}")
    public PluginMeta get(@PathVariable String pluginId) {
        return registry.getMeta(pluginId);
    }

    /**
     * 启动插件
     */
    @PostMapping("/{pluginId}/start")
    public boolean start(@PathVariable String pluginId) {
        return registry.start(pluginId);
    }

    /**
     * 停止插件
     */
    @PostMapping("/{pluginId}/stop")
    public boolean stop(@PathVariable String pluginId) {
        return registry.stop(pluginId);
    }

    /**
     * 卸载插件
     */
    @DeleteMapping("/{pluginId}")
    public boolean uninstall(@PathVariable String pluginId) {
        return registry.unregister(pluginId);
    }
}
