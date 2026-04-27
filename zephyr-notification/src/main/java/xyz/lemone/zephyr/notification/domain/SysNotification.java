package xyz.lemone.zephyr.notification.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class SysNotification implements Serializable {
    private Long id;
    private String title;
    private String content;
    private String type;
    private Long senderId;
    private Long receiverId;
    private String status;
    private LocalDateTime readTime;
    private LocalDateTime createTime;
    private Integer deleted;
}
