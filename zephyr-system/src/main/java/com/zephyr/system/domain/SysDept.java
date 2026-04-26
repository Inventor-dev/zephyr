package com.zephyr.system.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 部门实体
 */
@Data
public class SysDept implements Serializable {

    private Long id;
    private String deptName;
    private Long parentId;
    private String ancestors;   // 祖级列表（0,1,2...）
    private Long orgId;
    private String leader;
    private String phone;
    private String email;
    private String status;
    private Integer orderNum;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
