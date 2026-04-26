package com.zephyr.plugin.core;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * 插件生命周期管理器
 * 应用启动时自动扫描并启动所有已注册插件
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Order(10)
public class PluginLifecycle implements ApplicationRunner {

    private final PluginRegistry registry;

    @Override
    public void run(ApplicationArguments args) {
        log.info("=== 插件框架启动 ===");

        // 启动所有非核心插件
        for (PluginMeta meta : registry.listAll()) {
            if (meta.getStatus() == PluginMeta.PluginStatus.REGISTERED) {
                registry.start(meta.getPluginId());
            }
        }

        int running = registry.listRunning().size();
        log.info("=== 插件框架启动完成，运行中: {} ===", running);
    }
}
