package com.zephyr.common.core.enums;

import lombok.Getter;

/**
 * 状态枚举
 */
@Getter
public enum StatusEnum {

    ENABLED(1, "启用"),
    DISABLED(0, "禁用");

    private final int code;
    private final String desc;

    StatusEnum(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
