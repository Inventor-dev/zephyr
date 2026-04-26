package com.zephyr.system.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 组织实体
 */
@Data
public class SysOrg implements Serializable {

    private Long id;
    private String orgName;
    private Long parentId;
    private Integer orgLevel;
    private String orgType;
    private String leader;
    private String phone;
    private String email;
    private String status;
    private Integer orderNum;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
