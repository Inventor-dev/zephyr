package xyz.lemone.zephyr.extension.controller;

import xyz.lemone.zephyr.common.core.domain.R;
import xyz.lemone.zephyr.extension.core.ExtensionRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/extension")
@RequiredArgsConstructor
public class ExtensionController {
    private final ExtensionRegistry registry;

    @GetMapping("/list")
    public R<Map<String, Object>> list() {
        return R.ok((Map<String, Object>) (Map<?, ?>) registry.listAll());
    }
}
