package xyz.lemone.zephyr.extension.core;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class ExtensionRegistry {
    private final Map<String, Extension<?>> registry = new ConcurrentHashMap<>();

    @SuppressWarnings("unchecked")
    public <T> void register(Extension<T> extension) {
        registry.put(extension.getExtensionId(), extension);
        log.info("扩展点注册: {}", extension.getExtensionId());
    }

    @SuppressWarnings("unchecked")
    public <T> Extension<T> getExtension(String extensionId) {
        return (Extension<T>) registry.get(extensionId);
    }

    public Map<String, Extension<?>> listAll() {
        return Map.copyOf(registry);
    }
}
