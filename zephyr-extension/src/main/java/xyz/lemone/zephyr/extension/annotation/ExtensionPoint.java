package xyz.lemone.zephyr.extension.annotation;

import java.lang.annotation.*;

/**
 * 扩展点注解
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ExtensionPoint {
    /** 扩展点唯一标识 */
    String id();
    /** 扩展点名称 */
    String name();
    /** 扩展点类型（SPI/EVENT/INTERCEPTOR/HOOK/STRATEGY） */
    ExtensionType type();
    /** 描述 */
    String description() default "";

    enum ExtensionType {
        SPI, EVENT, INTERCEPTOR, HOOK, STRATEGY
    }
}
