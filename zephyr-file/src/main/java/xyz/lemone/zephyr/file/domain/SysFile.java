package xyz.lemone.zephyr.file.domain;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class SysFile implements Serializable {
    private Long id;
    private String fileName;
    private String originalName;
    private String filePath;
    private String fileUrl;
    private Long fileSize;
    private String fileType;
    private String storageType;
    private Long createUserId;
    private LocalDateTime createTime;
    private Integer deleted;
}
