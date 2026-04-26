package com.zephyr.job.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class SysJob implements Serializable {
    private Long id;
    private String jobName;
    private String jobGroup;
    private String cronExpression;
    private String invokeTarget;
    private String misfirePolicy;
    private String concurrent;
    private String status;
    private String remark;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
