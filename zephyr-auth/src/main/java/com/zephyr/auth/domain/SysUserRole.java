package com.zephyr.auth.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户角色关联
 */
@Data
public class SysUserRole implements Serializable {

    private Long id;
    private Long userId;
    private Long roleId;
    private LocalDateTime createTime;
}
