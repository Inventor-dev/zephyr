package xyz.lemone.zephyr.common.core.enums;

import lombok.Getter;

/**
 * 数据范围枚举
 */
@Getter
public enum DataScopeEnum {

    ALL(1, "全部数据"),
    DEPT(2, "本部门数据"),
    DEPT_AND_CHILD(3, "本部门及下级数据"),
    SELF(4, "仅本人数据");

    private final int code;
    private final String desc;

    DataScopeEnum(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
