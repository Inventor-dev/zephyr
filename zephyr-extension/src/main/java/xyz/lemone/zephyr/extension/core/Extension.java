package xyz.lemone.zephyr.extension.core;

/**
 * 扩展点接口
 */
public interface Extension<T> {
    /** 扩展点标识 */
    String getExtensionId();
    /** 执行扩展逻辑 */
    T execute(Object... args);
}
