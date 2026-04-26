package com.zephyr.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Zephyr 聚合启动模块
 * 本地开发时可同时启动所有模块
 */
@SpringBootApplication
public class ZephyrAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZephyrAdminApplication.class, args);
    }
}
