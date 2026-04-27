package xyz.lemone.zephyr.codegen.service;

import xyz.lemone.zephyr.codegen.domain.GenTable;
import java.util.List;
import java.util.Map;

public interface GenService {
    List<GenTable> selectAll();
    GenTable selectById(Long id);
    Map<String, String> previewCode(Long id);
}
