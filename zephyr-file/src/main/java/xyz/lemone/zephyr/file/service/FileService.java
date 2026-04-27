package xyz.lemone.zephyr.file.service;

import xyz.lemone.zephyr.file.domain.SysFile;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    SysFile upload(MultipartFile file);
    SysFile selectById(Long id);
    boolean delete(Long id);
}
