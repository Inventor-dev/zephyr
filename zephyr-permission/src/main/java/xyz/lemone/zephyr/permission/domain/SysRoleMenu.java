package xyz.lemone.zephyr.permission.domain;

import lombok.Data;
import java.io.Serializable;

/**
 * 角色菜单关联
 */
@Data
public class SysRoleMenu implements Serializable {

    private Long id;
    private Long roleId;
    private Long menuId;
}
