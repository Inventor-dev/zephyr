package xyz.lemone.zephyr.form.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class FormDefinition implements Serializable {
    private Long id;
    private String formName;
    private String formCode;
    private String description;
    private String formConfig;    // JSON: 组件配置
    private String status;
    private String version;
    private Long createUserId;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
