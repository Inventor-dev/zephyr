package com.zephyr.common.core.annotation;

import java.lang.annotation.*;

/**
 * 操作日志注解
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface OperLog {

    /** 模块名称 */
    String module() default "";

    /** 操作描述 */
    String description() default "";

    /** 操作类型 */
    OperType type() default OperType.OTHER;

    enum OperType {
        INSERT, UPDATE, DELETE, QUERY, EXPORT, IMPORT, LOGIN, LOGOUT, OTHER
    }
}
