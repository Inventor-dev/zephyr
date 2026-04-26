package com.zephyr.plugin.core;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 插件元信息
 */
@Data
public class PluginMeta {

    /** 插件唯一标识 */
    private String pluginId;

    /** 插件名称 */
    private String pluginName;

    /** 版本 */
    private String version;

    /** 状态 */
    private PluginStatus status;

    /** 是否核心模块 */
    private boolean core;

    /** 描述 */
    private String description;

    /** 作者 */
    private String author;

    /** 注册时间 */
    private LocalDateTime registeredAt;

    /** 最后启动时间 */
    private LocalDateTime startedAt;

    /** 最后停止时间 */
    private LocalDateTime stoppedAt;

    /** 错误信息 */
    private String errorMessage;

    public enum PluginStatus {
        REGISTERED,   // 已注册
        STARTING,     // 启动中
        RUNNING,      // 运行中
        STOPPING,     // 停止中
        STOPPED,      // 已停止
        UNLOADED,     // 已卸载
        ERROR         // 异常
    }
}
