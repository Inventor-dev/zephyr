package com.zephyr.log.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class SysOperLog implements Serializable {
    private Long id;
    private String module;
    private String description;
    private String operType;
    private String method;
    private String requestMethod;
    private String requestUrl;
    private String requestParam;
    private String responseResult;
    private Long operUserId;
    private String operUsername;
    private String operIp;
    private Integer status;
    private String errorMsg;
    private Long costTime;
    private LocalDateTime operTime;
}
