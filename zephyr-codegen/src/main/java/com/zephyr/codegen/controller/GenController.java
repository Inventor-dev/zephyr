package com.zephyr.codegen.controller;

import com.zephyr.codegen.domain.GenTable;
import com.zephyr.codegen.service.GenService;
import com.zephyr.common.core.domain.R;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/codegen")
@RequiredArgsConstructor
public class GenController {
    private final GenService genService;

    @GetMapping("/list") public R<List<GenTable>> list() { return R.ok(genService.selectAll()); }
    @GetMapping("/{id}") public R<GenTable> getById(@PathVariable Long id) { return R.ok(genService.selectById(id)); }
    @GetMapping("/preview/{id}") public R<Map<String, String>> preview(@PathVariable Long id) { return R.ok(genService.previewCode(id)); }
}
