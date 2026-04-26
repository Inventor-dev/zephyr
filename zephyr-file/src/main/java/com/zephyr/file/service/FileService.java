package com.zephyr.file.service;

import com.zephyr.file.domain.SysFile;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    SysFile upload(MultipartFile file);
    SysFile selectById(Long id);
    boolean delete(Long id);
}
