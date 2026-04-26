package com.zephyr.codegen.service.impl;

import com.zephyr.codegen.domain.GenTable;
import com.zephyr.codegen.service.GenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GenServiceImpl implements GenService {

    @Override
    public List<GenTable> selectAll() {
        // TODO: 查询数据库
        return List.of();
    }

    @Override
    public GenTable selectById(Long id) {
        // TODO: 查询数据库
        return null;
    }

    @Override
    public Map<String, String> previewCode(Long id) {
        // TODO: 代码生成预览
        Map<String, String> preview = new HashMap<>();
        preview.put("Entity.java", "// TODO: Entity code");
        preview.put("Mapper.java", "// TODO: Mapper code");
        preview.put("Service.java", "// TODO: Service code");
        preview.put("Controller.java", "// TODO: Controller code");
        return preview;
    }
}
