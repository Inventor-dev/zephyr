package com.zephyr.plugin.core;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 插件注册中心
 */
@Slf4j
@Component
public class PluginRegistry {

    /** 已注册插件 */
    private final Map<String, Plugin> plugins = new ConcurrentHashMap<>();

    /** 插件元信息 */
    private final Map<String, PluginMeta> metaMap = new ConcurrentHashMap<>();

    /**
     * 注册插件
     */
    public boolean register(Plugin plugin) {
        String id = plugin.getPluginId();
        if (plugins.containsKey(id)) {
            log.warn("插件已注册: {}", id);
            return false;
        }

        PluginMeta meta = new PluginMeta();
        meta.setPluginId(id);
        meta.setPluginName(plugin.getPluginName());
        meta.setVersion(plugin.getVersion());
        meta.setCore(plugin.isCore());
        meta.setStatus(PluginMeta.PluginStatus.REGISTERED);
        meta.setRegisteredAt(java.time.LocalDateTime.now());

        plugins.put(id, plugin);
        metaMap.put(id, meta);
        log.info("插件注册成功: {} v{}", plugin.getPluginName(), plugin.getVersion());
        return true;
    }

    /**
     * 卸载插件
     */
    public boolean unregister(String pluginId) {
        Plugin plugin = plugins.get(pluginId);
        if (plugin == null) {
            log.warn("插件不存在: {}", pluginId);
            return false;
        }

        PluginMeta meta = metaMap.get(pluginId);
        if (meta != null && meta.isCore()) {
            log.error("核心模块不可卸载: {}", pluginId);
            return false;
        }

        try {
            plugin.onUnload();
        } catch (Exception e) {
            log.error("插件卸载回调异常: {}", pluginId, e);
        }

        plugins.remove(pluginId);
        metaMap.remove(pluginId);
        log.info("插件已卸载: {}", pluginId);
        return true;
    }

    /**
     * 启动插件
     */
    public boolean start(String pluginId) {
        Plugin plugin = plugins.get(pluginId);
        PluginMeta meta = metaMap.get(pluginId);
        if (plugin == null || meta == null) return false;

        meta.setStatus(PluginMeta.PluginStatus.STARTING);
        try {
            plugin.onStart();
            meta.setStatus(PluginMeta.PluginStatus.RUNNING);
            meta.setStartedAt(java.time.LocalDateTime.now());
            log.info("插件已启动: {}", pluginId);
            return true;
        } catch (Exception e) {
            meta.setStatus(PluginMeta.PluginStatus.ERROR);
            meta.setErrorMessage(e.getMessage());
            log.error("插件启动失败: {}", pluginId, e);
            return false;
        }
    }

    /**
     * 停止插件
     */
    public boolean stop(String pluginId) {
        Plugin plugin = plugins.get(pluginId);
        PluginMeta meta = metaMap.get(pluginId);
        if (plugin == null || meta == null) return false;

        meta.setStatus(PluginMeta.PluginStatus.STOPPING);
        try {
            plugin.onStop();
            meta.setStatus(PluginMeta.PluginStatus.STOPPED);
            meta.setStoppedAt(java.time.LocalDateTime.now());
            log.info("插件已停止: {}", pluginId);
            return true;
        } catch (Exception e) {
            meta.setStatus(PluginMeta.PluginStatus.ERROR);
            meta.setErrorMessage(e.getMessage());
            log.error("插件停止失败: {}", pluginId, e);
            return false;
        }
    }

    /**
     * 获取插件
     */
    public Plugin getPlugin(String pluginId) {
        return plugins.get(pluginId);
    }

    /**
     * 获取插件元信息
     */
    public PluginMeta getMeta(String pluginId) {
        return metaMap.get(pluginId);
    }

    /**
     * 获取所有插件列表
     */
    public List<PluginMeta> listAll() {
        return new ArrayList<>(metaMap.values());
    }

    /**
     * 获取运行中的插件
     */
    public List<PluginMeta> listRunning() {
        return metaMap.values().stream()
                .filter(m -> m.getStatus() == PluginMeta.PluginStatus.RUNNING)
                .toList();
    }

    /**
     * 插件是否已注册
     */
    public boolean isRegistered(String pluginId) {
        return plugins.containsKey(pluginId);
    }
}
