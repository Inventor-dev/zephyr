package xyz.lemone.zephyr.permission.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 菜单/权限实体
 */
@Data
public class SysMenu implements Serializable {

    private Long id;
    private Long parentId;
    private String menuName;
    private String menuType;     // M=目录 C=菜单 F=按钮
    private String perms;        // 权限标识（如 user:list）
    private String path;
    private String component;
    private String icon;
    private Integer orderNum;
    private String visible;      // 1=显示 0=隐藏
    private String status;
    private String permsType;    // G=自定义按钮权限 N=跟随上级
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
