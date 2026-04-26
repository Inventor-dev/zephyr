package com.zephyr.dict.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class SysDictType implements Serializable {
    private Long id;
    private String dictName;
    private String dictType;
    private String status;
    private String remark;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
