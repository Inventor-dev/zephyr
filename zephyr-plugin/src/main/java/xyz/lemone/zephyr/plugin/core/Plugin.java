package xyz.lemone.zephyr.plugin.core;

/**
 * 插件接口 — 所有插件必须实现
 */
public interface Plugin {

    /**
     * 插件唯一标识
     */
    String getPluginId();

    /**
     * 插件名称
     */
    String getPluginName();

    /**
     * 插件版本
     */
    String getVersion();

    /**
     * 是否为核心模块（不可卸载）
     */
    default boolean isCore() {
        return false;
    }

    /**
     * 插件启动时回调
     */
    default void onStart() {}

    /**
     * 插件停止时回调
     */
    default void onStop() {}

    /**
     * 插件卸载前回调
     */
    default void onUnload() {}
}
