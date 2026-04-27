package xyz.lemone.zephyr.file.service.impl;

import xyz.lemone.zephyr.common.core.exception.BusinessException;
import xyz.lemone.zephyr.common.core.utils.IdUtils;
import xyz.lemone.zephyr.file.domain.SysFile;
import xyz.lemone.zephyr.file.service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
public class FileServiceImpl implements FileService {

    @Value("${file.upload-path:./uploads}")
    private String uploadPath;

    @Override
    public SysFile upload(MultipartFile file) {
        if (file.isEmpty()) throw new BusinessException("FILE_EMPTY", "文件不能为空");

        String originalName = file.getOriginalFilename();
        String ext = originalName != null ? originalName.substring(originalName.lastIndexOf(".")) : "";
        String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String fileName = IdUtils.nextShortId() + ext;
        String filePath = datePath + "/" + fileName;

        try {
            File dest = new File(uploadPath + "/" + filePath);
            dest.getParentFile().mkdirs();
            file.transferTo(dest);
        } catch (Exception e) {
            throw new BusinessException("FILE_UPLOAD_FAIL", "文件上传失败: " + e.getMessage());
        }

        SysFile sysFile = new SysFile();
        sysFile.setFileName(fileName);
        sysFile.setOriginalName(originalName);
        sysFile.setFilePath(filePath);
        sysFile.setFileUrl("/uploads/" + filePath);
        sysFile.setFileSize(file.getSize());
        sysFile.setFileType(ext);
        sysFile.setStorageType("local");
        sysFile.setDeleted(0);
        // TODO: 保存到数据库
        return sysFile;
    }

    @Override
    public SysFile selectById(Long id) {
        // TODO: 查询数据库
        return null;
    }

    @Override
    public boolean delete(Long id) {
        // TODO: 逻辑删除
        return true;
    }
}
