package com.zephyr.extension.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class SysExtension implements Serializable {
    private Long id;
    private String extensionId;
    private String extensionName;
    private String extensionType;
    private String description;
    private String status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
