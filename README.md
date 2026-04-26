# Zephyr

> 🌬️ 和风 · 微风 — 多模块基础系统

Zephyr 是一个基于 **Spring Boot 4.x + Java 25 + React + Qiankun** 的多模块基础系统，采用 COLA 分层架构，支持插件化模块动态加载卸载、动态表单、扩展点机制，可快速构建企业级业务系统。

## ✨ 核心特性

- 🏗️ **COLA 分层架构** — Adapter → App → Domain → Infrastructure，职责清晰
- 🔌 **插件化模块管理** — 模块动态注册、加载、卸载，核心模块不可卸载
- 🖥️ **多端点应用** — 一个系统多个入口，独立 Logo、布局、主题配置
- 📋 **动态表单** — 可视化表单设计器，支持 16 种组件、条件联动
- 🔌 **扩展点框架** — SPI / 事件 / 拦截器 / 钩子 / 策略 五种扩展模式
- 🛡️ **RBAC4 权限** — 角色继承、组织层级权限、四级数据范围
- 🌍 **多语言** — i18next + Spring MessageSource，支持中英日
- 📱 **微前端** — Qiankun 2.x，前后端代码同模块（webapp/）
- 📐 **Ant Design Pro 规范** — 统一返回结构，开箱即用

## 🧩 功能模块

| 模块 | 说明 | 端口 |
|------|------|------|
| zephyr-auth | 认证与用户管理 | 7102 |
| zephyr-permission | 权限管理（RBAC4） | 7103 |
| zephyr-dict | 数据字典 | 7104 |
| zephyr-log | 日志审计 | 7105 |
| zephyr-monitor | 系统监控 | 7106 |
| zephyr-codegen | 代码生成器 | 7107 |
| zephyr-file | 文件管理 | 7108 |
| zephyr-job | 定时任务 | 7109 |
| zephyr-notification | 消息通知 | 7110 |
| zephyr-form | 动态表单 | 7111 |
| zephyr-extension | 扩展点管理 | 7112 |

## 🛠️ 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| JDK | OpenJDK | 25 LTS |
| 后端 | Spring Boot | 4.x |
| ORM | Fluent-MyBatis | 1.6.x |
| 数据库 | MySQL | 8.0+ |
| 缓存 | Redis | 7.x |
| 认证 | Sa-Token | 1.39.x |
| 前端 | React + Ant Design | 18.x / 5.x |
| 微前端 | Qiankun | 2.x |
| 构建 | Vite + pnpm | 5.x / 9.x |

## 📁 项目结构

```
zephyr/
├── zephyr-admin/          # 聚合启动模块
├── zephyr-common/         # 公共基础
├── zephyr-system/         # 系统管理（COLA 四层 + webapp/）
├── zephyr-auth/           # 认证域
├── zephyr-permission/     # 权限域
├── zephyr-dict/           # 字典域
├── zephyr-log/            # 日志域
├── zephyr-gateway/        # API 网关
├── zephyr-monitor/        # 系统监控
├── zephyr-codegen/        # 代码生成器
├── zephyr-file/           # 文件管理
├── zephyr-job/            # 定时任务
├── zephyr-notification/   # 消息通知
├── zephyr-form/           # 动态表单
├── zephyr-plugin/         # 插件框架
├── zephyr-extension/      # 扩展点框架
├── design/                # 设计文档（按版本管理）
│   └── v1.0/
│       ├── requirements.md
│       ├── design.md
│       ├── architecture.html
│       └── logo.html
├── sql/                   # 数据库脚本
├── shared/                # 前端共享组件
│   ├── components/
│   ├── hooks/
│   └── theme/
└── LICENSE
```

## 🚀 快速开始

```bash
# 后端
mvn clean install
java -jar zephyr-admin/target/zephyr-admin.jar

# 前端
cd shared && pnpm install && pnpm dev
cd zephyr-admin/webapp && pnpm dev
```

## 📄 License

[Apache License 2.0](LICENSE)

Copyright (c) 2026 lemon
