package com.zephyr.plugin.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * 插件框架自动配置
 */
@Configuration
@ComponentScan(basePackages = "com.zephyr.plugin")
public class PluginAutoConfig {
}
