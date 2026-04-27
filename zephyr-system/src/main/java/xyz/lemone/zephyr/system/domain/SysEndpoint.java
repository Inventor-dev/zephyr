package xyz.lemone.zephyr.system.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 端点（应用）实体
 */
@Data
public class SysEndpoint implements Serializable {

    private Long id;
    private String appName;          // 应用名称
    private String appCode;          // 应用编码（唯一）
    private String appLogo;          // 应用 Logo
    private String appDescription;   // 应用描述
    private String layoutType;       // 布局类型
    private String themeConfig;      // 主题配置（JSON）
    private String status;
    private Integer orderNum;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
