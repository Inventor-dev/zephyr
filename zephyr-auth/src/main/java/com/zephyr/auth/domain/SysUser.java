package com.zephyr.auth.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户实体
 */
@Data
public class SysUser implements Serializable {

    private Long id;
    private String username;
    private String password;
    private String nickname;
    private String email;
    private String phone;
    private String avatar;
    private String status;       // 1=启用 0=禁用
    private Long orgId;
    private Long deptId;
    private String deptName;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private String createBy;
    private String updateBy;
    private Integer deleted;     // 0=未删 1=已删
}
