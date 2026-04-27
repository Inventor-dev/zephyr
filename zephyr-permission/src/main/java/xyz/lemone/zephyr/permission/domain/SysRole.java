package xyz.lemone.zephyr.permission.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 角色实体（RBAC4：支持角色继承）
 */
@Data
public class SysRole implements Serializable {

    private Long id;
    private String roleName;
    private String roleKey;
    private Integer roleSort;
    private String status;
    private String dataScope;    // 数据范围：1=全部 2=本部门 3=本部门及下级 4=仅本人
    private Long parentRoleId;   // 父角色 ID（角色继承）
    private String remark;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;

    /** 子角色列表（非数据库字段） */
    private List<SysRole> children;
}
