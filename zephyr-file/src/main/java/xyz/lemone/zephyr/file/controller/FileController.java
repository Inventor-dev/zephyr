package xyz.lemone.zephyr.file.controller;

import xyz.lemone.zephyr.common.core.domain.R;
import xyz.lemone.zephyr.file.domain.SysFile;
import xyz.lemone.zephyr.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @PostMapping("/upload")
    public R<SysFile> upload(@RequestParam("file") MultipartFile file) { return R.ok(fileService.upload(file)); }
    @GetMapping("/{id}")
    public R<SysFile> getById(@PathVariable Long id) { return R.ok(fileService.selectById(id)); }
    @DeleteMapping("/{id}")
    public R<Boolean> delete(@PathVariable Long id) { return R.ok(fileService.delete(id)); }
}
