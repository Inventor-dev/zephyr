package xyz.lemone.zephyr.plugin.core;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.util.List;

/**
 * 自动扫描带 @PluginAnnotation 的 Bean 并注册
 */
@Slf4j
@Configuration
@ConditionalOnBean(PluginRegistry.class)
public class PluginAutoRegister {

    @Autowired
    private PluginRegistry registry;

    @Autowired(required = false)
    private List<Plugin> pluginList;

    @PostConstruct
    public void registerPlugins() {
        if (pluginList == null || pluginList.isEmpty()) {
            log.info("未发现任何插件实现");
            return;
        }

        for (Plugin plugin : pluginList) {
            try {
                registry.register(plugin);
            } catch (Exception e) {
                log.error("插件注册失败: {}", plugin.getPluginId(), e);
            }
        }

        log.info("插件自动注册完成，共注册 {} 个插件", pluginList.size());
    }
}
