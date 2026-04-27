package xyz.lemone.zephyr.plugin.annotation;

import java.lang.annotation.*;

/**
 * 插件注解 — 标记一个类为插件
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PluginAnnotation {

    /** 插件唯一标识 */
    String id();

    /** 插件名称 */
    String name();

    /** 版本号 */
    String version() default "1.0.0";

    /** 是否核心模块 */
    boolean core() default false;

    /** 描述 */
    String description() default "";

    /** 作者 */
    String author() default "";
}
