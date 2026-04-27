package xyz.lemone.zephyr.form.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class FormData implements Serializable {
    private Long id;
    private Long formDefinitionId;
    private String formData;      // JSON: 表单数据
    private Long submitUserId;
    private String status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
