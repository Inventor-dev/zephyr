# 多模块基础系统 — 产品需求文档（PRD）

> **版本：** v1.0  
> **日期：** 2026-04-24  
> **状态：** 初稿  

---

## 1. 项目背景与目标

### 1.1 背景

在企业级应用开发中，几乎每个新项目都需要重复搭建用户认证、权限控制、数据字典、操作日志等基础能力。这些"脚手架"工作占据项目初期 30%-50% 的开发周期，且各团队实现方式不统一，导致：

- **重复造轮子**：每个项目独立实现基础模块，代码复用率低
- **维护成本高**：基础能力分散在各项目中，升级和修复需要逐一同步
- **架构不统一**：不同项目的技术选型和架构风格差异大，团队协作困难
- **扩展困难**：新增业务模块时缺乏标准化的接入方式

### 1.2 目标

构建一套 **多模块基础系统（Zephyr）**，作为企业级业务系统的底层基座，实现：

| 目标 | 描述 |
|------|------|
| **快速交付** | 新业务系统基于此平台搭建，基础能力开箱即用，开发周期缩短 50%+ |
| **统一架构** | 提供标准化的后端模块划分和前端微前端架构，确保技术栈一致性 |
| **可插拔扩展** | 业务模块以插件形式接入，按需加载，互不耦合 |
| **多租户就绪** | 架构层面预留多租户支持，满足 SaaS 化需求 |
| **技术先进性** | 采用 Spring Boot 4.x + Java 25 + React + Qiankun，面向未来 3-5 年技术演进 |

### 1.3 适用范围

- 企业内部管理系统（OA、ERP、CRM、HRM 等）
- 中后台数据管理平台
- 需要快速原型验证的业务系统
- 多团队协作的大型平台型项目

---

## 2. 核心功能模块划分

### 2.1 模块总览

```
Zephyr
├── 🔐 认证与用户管理（Auth & User）
├── 🛡️ 权限管理（Permission / RBAC4）
├── 📖 数据字典管理（Dictionary）
├── 📝 日志管理（Logging / Audit）
├── 🧩 代码生成器（Code Generator）
├── 🌐 API 网关（API Gateway）
├── 📊 系统监控（Monitor）
├── 📁 文件管理（File Storage）
├── ⏰ 定时任务（Scheduler）
├── 🔔 消息通知（Notification）
└── 📋 动态表单（Dynamic Form）
└── 🔌 扩展点（Extension Points）
```

### 2.2 模块详细说明

---

#### 2.2.1 认证与用户管理（Auth & User）— P0

**职责：** 统一的身份认证与用户生命周期管理

| 功能项 | 说明 |
|--------|------|
| 用户注册/注销 | 支持邮箱、手机号、第三方 OAuth2.0 注册 |
| 登录认证 | 账密登录、短信验证码、OAuth2.0（微信/钉钉/飞书）、SAML 2.0 |
| Token 管理 | JWT + Refresh Token 双令牌机制，支持 Token 黑名单 |
| 用户信息管理 | 基础字段（姓名、头像、部门）+ 自定义扩展字段 |
| 组织架构 | 多级部门树、岗位管理、人员调动 |
| 多租户 | 租户隔离（共享库 Schema 级隔离 或 独立库隔离，可配置） |
| 安全策略 | 密码强度校验、登录失败锁定、IP 白名单、会话并发控制 |

**数据模型核心实体：**
- `sys_user` — 用户表
- `sys_dept` — 部门表
- `sys_post` — 岗位表
- `sys_tenant` — 租户表
- `sys_user_role` — 用户角色关联

---

#### 2.2.2 权限管理（Permission / RBAC4）— P0

**职责：** 基于 RBAC4 模型的增强型细粒度权限控制

| 功能项 | 说明 |
|--------|------|
| 角色管理 | 角色 CRUD、角色层级（继承）、角色有效期 |
| 菜单管理 | 树形菜单、菜单类型（目录/菜单/按钮）、前端路由映射 |
| 按钮权限 | 基于资源标识的按钮级权限控制 |
| 数据权限 | 本人数据 / 本部门数据 / 本部门及下级 / 全部数据（四级数据权限） |
| API 权限 | 接口级别的访问控制，与网关联动 |
| 权限缓存 | Redis 缓存权限数据，变更时主动失效 |

**RBAC4 模型：**

RBAC4 在传统 RBAC 基础上增加了组织层级、角色继承、数据范围控制：

```
用户 ──N:N── 角色 ──N:N── 菜单/权限
                    │
                    ├── 数据范围（data_scope）
                    │   ├── 1: 全部数据
                    │   ├── 2: 本部门数据
                    │   ├── 3: 本部门及下级数据
                    │   └── 4: 仅本人数据
                    │
                    ├── 角色继承（parent_role_id）
                    │   └── 子角色继承父角色的权限
                    │
                    └── 组织关联（org_role）
                        └── 角色绑定到特定组织层级
```

**RBAC4 核心特性：**
| 特性 | 说明 |
|------|------|
| 基础 RBAC | 用户-角色-权限 三元组 |
| 角色继承 | 子角色自动继承父角色权限 |
| 组织层级权限 | 权限绑定组织树，自动向下继承 |
| 数据范围 | 四级数据隔离（全部/部门/部门+下级/仅本人） |
| 权限组合 | 支持权限的并集、交集、差集运算 |
| 动态权限 | 运行时可调整权限，实时生效 |

**数据模型核心实体：**
- `sys_role` — 角色表
- `sys_menu` — 菜单/权限表
- `sys_role_menu` — 角色菜单关联
- `sys_role_dept` — 角色数据范围关联

---

#### 2.2.3 数据字典管理（Dictionary）— P0

**职责：** 统一管理系统中的枚举值和配置项

| 功能项 | 说明 |
|--------|------|
| 字典类型管理 | 字典分类（如：性别、状态、类型等） |
| 字典数据管理 | 字典项的增删改查、排序、启用/禁用 |
| 前端缓存 | 字典数据前端缓存，减少重复请求 |
| 后端缓存 | Redis 缓存，支持主动刷新 |
| 导入导出 | 支持 Excel 批量导入导出字典数据 |

**数据模型核心实体：**
- `sys_dict_type` — 字典类型表
- `sys_dict_data` — 字典数据表

---

#### 2.2.4 日志管理（Logging / Audit）— P0

**职责：** 全链路操作审计与系统日志

| 功能项 | 说明 |
|--------|------|
| 操作日志 | 基于 AOP 自动记录关键操作（增删改）、请求参数、响应结果、耗时 |
| 登录日志 | 登录成功/失败记录、登录 IP、设备信息 |
| 异常日志 | 全局异常捕获记录，堆栈信息 |
| 日志查询 | 多维度检索（时间、操作人、模块、状态）、分页 |
| 日志清理 | 自动归档过期日志（可配置保留天数） |
| 敏感脱敏 | 日志中敏感字段（密码、手机号、身份证）自动脱敏 |

**数据模型核心实体：**
- `sys_oper_log` — 操作日志表
- `sys_login_log` — 登录日志表
- `sys_error_log` — 异常日志表

---

#### 2.2.5 代码生成器（Code Generator）— P1

**职责：** 基于数据库表结构自动生成 CRUD 代码

| 功能项 | 说明 |
|--------|------|
| 表结构读取 | 连接数据库，读取表结构和字段注释 |
| 模板引擎 | 基于 FreeMarker/Velocity 模板，支持自定义模板 |
| 生成内容 | Entity、DTO、VO、Controller、Service、Mapper、前端页面（React + Ant Design） |
| 生成策略 | 单表 CRUD、主子表关联、树形结构 |
| 预览与下载 | 在线预览生成代码，打包下载 |
| 模板管理 | 内置常用模板，支持用户自定义模板上传 |

---

#### 2.2.6 API 网关（API Gateway）— P1

**职责：** 统一的 API 入口和流量管控

| 功能项 | 说明 |
|--------|------|
| 路由转发 | 基于路径/Host/Header 的动态路由规则 |
| 负载均衡 | 支持轮询、加权、一致性哈希等策略 |
| 认证鉴权 | 统一 Token 校验，与权限模块联动 |
| 限流熔断 | 基于令牌桶/滑动窗口的限流，Sentinel/Resilience4j 熔断 |
| 请求改写 | Header 注入、路径重写、参数映射 |
| 日志采集 | 请求/响应日志采集，链路追踪（Trace ID） |
| 灰度发布 | 基于 Header/Cookie 的流量染色和灰度路由 |

**技术选型：** Spring Cloud Gateway（与 Spring Boot 4.x 生态契合）

---

#### 2.2.7 系统监控（Monitor）— P1

**职责：** 运行时健康检查与性能监控

| 功能项 | 说明 |
|--------|------|
| 服务健康检查 | Spring Boot Actuator + 自定义健康指标 |
| JVM 监控 | 堆内存、GC、线程、类加载 |
| 数据库监控 | 连接池状态、慢 SQL 统计 |
| 在线用户 | 当前在线用户列表、强制下线 |
| 缓存监控 | Redis 命中率、内存使用、Key 统计 |
| 接口统计 | 接口调用次数、平均耗时、错误率 |

---

#### 2.2.8 文件管理（File Storage）— P2

**职责：** 统一的文件上传、存储和访问

| 功能项 | 说明 |
|--------|------|
| 文件上传 | 单文件/多文件上传、分片上传、断点续传 |
| 存储后端 | 本地存储 / MinIO / 阿里云 OSS / 腾讯 COS（可插拔） |
| 文件预览 | 图片缩略图、PDF/Word 在线预览 |
| 存储策略 | 按租户隔离存储路径、文件类型限制、大小限制 |
| CDN 加速 | 支持 CDN 回源配置 |

---

#### 2.2.9 定时任务（Scheduler）— P2

**职责：** 分布式定时任务管理

| 功能项 | 说明 |
|--------|------|
| 任务管理 | Cron 表达式配置、手动触发、暂停/恢复 |
| 执行器管理 | 执行器注册、健康检查 |
| 执行日志 | 任务执行记录、耗时统计、失败重试 |
| 分布式锁 | 基于 Redis 的分布式锁，防止重复执行 |

**技术选型：** XXL-JOB 或自研轻量级调度器

---

#### 2.2.10 消息通知（Notification）— P2

**职责：** 统一的消息推送能力

| 功能项 | 说明 |
|--------|------|
| 站内信 | 系统内消息通知、已读/未读 |
| 邮件通知 | SMTP 邮件发送、模板管理 |
| 短信通知 | 短信网关对接（阿里云/腾讯云） |
| Webhook | 企业微信/钉钉/飞书机器人推送 |
| 消息模板 | 通用消息模板管理，支持变量替换 |

---

## 3. 微前端模块划分

### 3.1 架构总览

```
┌─────────────────────────────────────────────────────┐
│                   主应用（Main Shell）                 │
│  ┌─────────────────────────────────────────────────┐ │
│  │  全局布局 / 路由 / 认证 / 主题 / 国际化           │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ 系统管理  │ │ 权限管理  │ │ 监控中心  │ │ 代码   │ │
│  │ 子应用    │ │ 子应用    │ │ 子应用    │ │ 生成器 │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ 字典管理  │ │ 日志管理  │ │ 业务模块  │  ...      │
│  │ 子应用    │ │ 子应用    │ │ (插件)    │            │
│  └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────┘
```

### 3.2 子应用划分

| 子应用名称 | 路由前缀 | 独立部署 | 说明 |
|-----------|---------|---------|------|
| **主应用（Shell）** | `/` | ✅ | 全局框架、登录页、布局、路由注册、全局状态 |
| **系统管理** | `/system` | ✅ | 用户管理、部门管理、岗位管理、组织架构 |
| **权限管理** | `/permission` | ✅ | 角色管理、菜单管理、权限分配 |
| **数据字典** | `/dict` | ✅ | 字典类型、字典数据管理 |
| **日志管理** | `/log` | ✅ | 操作日志、登录日志、异常日志 |
| **系统监控** | `/monitor` | ✅ | 健康检查、在线用户、缓存监控、JVM 监控 |
| **代码生成器** | `/codegen` | ✅ | 表结构读取、代码生成、模板管理 |
| **文件管理** | `/file` | ✅ | 文件上传、存储管理 |
| **定时任务** | `/job` | ✅ | 任务配置、执行日志 |
| **消息通知** | `/notification` | ✅ | 站内信、消息模板 |
| **业务模块示例** | `/biz/*` | ✅ | 演示如何接入新业务模块 |

### 3.5 动态表单（Dynamic Form）

#### 功能概述

动态表单允许管理员通过可视化界面设计表单，无需编写代码。支持多种组件类型、表单验证、数据联动、条件显隐等。

#### 支持的组件类型

| 类型 | 组件名 | 说明 |
|------|--------|------|
| 输入 | Input | 文本输入框 |
| 输入 | Textarea | 多行文本 |
| 输入 | Number | 数字输入框 |
| 选择 | Select | 下拉选择 |
| 选择 | TreeSelect | 树形选择 |
| 选择 | Cascader | 级联选择 |
| 选择 | Radio | 单选框 |
| 选择 | Checkbox | 复选框 |
| 日期 | DatePicker | 日期选择器 |
| 日期 | TimePicker | 时间选择器 |
| 日期 | RangePicker | 日期范围 |
| 开关 | Switch | 开关 |
| 评分 | Rate | 评分 |
| 上传 | Upload | 文件上传 |
| 富文本 | RichText | 富文本编辑器 |
| 颜色 | ColorPicker | 颜色选择器 |

#### 表单设计器

```
┌─────────────────────────────────────────────────────────┐
│                     表单设计器                            │
├─────────────┬─────────────────────┬─────────────────────┤
│  组件面板    │     画布区域         │    属性面板          │
│             │                     │                     │
│  📝 Input   │  ┌───────────────┐  │  字段名称: username  │
│  📝 Textarea│  │ 用户名: [   ] │  │  标  签: 用户名     │
│  🔢 Number  │  │ 昵称:   [   ] │  │  占位符: 请输入     │
│  📋 Select  │  │ 邮箱:   [   ] │  │  必  填: ✅         │
│  📅 Date    │  │ 手机号: [   ] │  │  长  度: 50         │
│  ⬆️ Upload  │  └───────────────┘  │  验  证: 手机号格式  │
│  ...        │                     │  联  动: -           │
└─────────────┴─────────────────────┴─────────────────────┘
```

#### 表单设计数据结构

```json
{
  "formId": "user_form_001",
  "formName": "用户注册表单",
  "version": 3,
  "fields": [
    {
      "fieldId": "f001",
      "type": "input",
      "label": "用户名",
      "placeholder": "请输入用户名",
      "required": true,
      "maxLength": 50,
      "rules": [
        { "type": "string", "min": 3, "max": 50, "message": "用户名长度3-50" }
      ],
      "span": 12,
      "sortOrder": 1
    },
    {
      "fieldId": "f002",
      "type": "select",
      "label": "部门",
      "required": true,
      "dataSource": {
        "type": "dict",
        "dictCode": "sys_dept"
      },
      "span": 12,
      "sortOrder": 2
    },
    {
      "fieldId": "f003",
      "type": "input",
      "label": "邮箱",
      "required": true,
      "rules": [
        { "type": "email", "message": "邮箱格式不正确" }
      ],
      "span": 12,
      "sortOrder": 3
    }
  ],
  "layout": {
    "columns": 24,
    "gutter": 16
  }
}
```

#### 条件联动规则

```json
{
  "fieldId": "f004",
  "type": "input",
  "label": "其他原因",
  "visible": {
    "trigger": "f003",
    "condition": "equals",
    "value": "other"
  },
  "required": {
    "trigger": "f003",
    "condition": "equals",
    "value": "other"
  }
}
```

#### 动态表单 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/form/list | 表单模板列表 |
| GET | /api/form/{formId} | 获取表单设计 |
| POST | /api/form | 创建表单模板 |
| PUT | /api/form/{formId} | 更新表单设计 |
| DELETE | /api/form/{formId} | 删除表单模板 |
| POST | /api/form/{formId}/publish | 发布表单 |
| POST | /api/form/{formId}/render | 渲染表单（返回前端配置） |
| POST | /api/form/submit/{formId} | 提交表单数据 |
| GET | /api/form/data/{formId} | 查询表单数据 |

#### 前端表单渲染引擎

```tsx
// FormRenderer.tsx — 根据表单配置动态渲染
import { Form, Input, Select, DatePicker, Switch } from 'antd';

interface FieldConfig {
    fieldId: string;
    type: string;
    label: string;
    required?: boolean;
    rules?: any[];
    dataSource?: { type: string; dictCode?: string };
    visible?: { trigger: string; condition: string; value: any };
}

function FormRenderer({ formConfig }: { formConfig: FormConfig }) {
    const [form] = Form.useForm();
    const values = Form.useWatch([], form);

    return (
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }}>
            {formConfig.fields
                .filter(field => !field.visible || evaluateCondition(field.visible, values))
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(field => (
                    <Form.Item
                        key={field.fieldId}
                        label={field.label}
                        name={field.fieldId}
                        rules={field.rules}
                        required={field.required}
                    >
                        {renderField(field)}
                    </Form.Item>
                ))}
        </Form>
    );
}

function renderField(field: FieldConfig) {
    switch (field.type) {
        case 'input': return <Input placeholder={field.placeholder} maxLength={field.maxLength} />;
        case 'textarea': return <Input.TextArea rows={4} />;
        case 'number': return <InputNumber style={{ width: '100%' }} />;
        case 'select': return <Select options={field.dataSource?.options} />;
        case 'datepicker': return <DatePicker style={{ width: '100%' }} />;
        case 'switch': return <Switch />;
        default: return <Input />;
    }
}
```

#### 表单数据存储

```sql
CREATE TABLE sys_form (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    form_id         VARCHAR(50) NOT NULL COMMENT '表单唯一标识',
    form_name       VARCHAR(100) NOT NULL COMMENT '表单名称',
    description     VARCHAR(500) COMMENT '描述',
    form_config     JSON NOT NULL COMMENT '表单设计配置(JSON)',
    version         INT DEFAULT 1 COMMENT '版本号',
    status          TINYINT DEFAULT 0 COMMENT '0草稿 1已发布 2已禁用',
    created_by      BIGINT COMMENT '创建人',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT DEFAULT 0,
    UNIQUE KEY uk_form_id (form_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动态表单模板表';

CREATE TABLE sys_form_data (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    form_id         VARCHAR(50) NOT NULL COMMENT '表单模板ID',
    biz_id          VARCHAR(50) COMMENT '关联业务ID',
    biz_type        VARCHAR(50) COMMENT '关联业务类型',
    form_data       JSON NOT NULL COMMENT '表单数据(JSON)',
    submit_user     BIGINT COMMENT '提交人',
    submit_time     DATETIME COMMENT '提交时间',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_form_id (form_id),
    KEY idx_biz (biz_type, biz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动态表单数据表';
```

---

### 3.6 扩展点（Extension Points）

#### 功能概述

系统提供标准化的扩展点机制，允许在不修改核心代码的情况下扩展业务逻辑。支持 SPI（Service Provider Interface）模式、事件监听、拦截器链、钩子函数等。

#### 扩展点类型

| 类型 | 说明 | 场景 |
|------|------|------|
| **SPI 扩展点** | 接口定义 + 实现注册 | 登录校验、数据转换、消息发送 |
| **事件扩展点** | 发布/订阅事件 | 用户创建后初始化、订单状态变更 |
| **拦截器扩展点** | 请求/响应拦截 | API 日志、权限校验、数据加密 |
| **钩子扩展点** | 生命周期钩子 | 模块加载前后、表单提交前后 |
| **策略扩展点** | 策略模式注入 | 文件存储策略、缓存策略、通知策略 |

#### 扩展点注册表

```sql
CREATE TABLE sys_extension_point (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    point_code      VARCHAR(100) NOT NULL COMMENT '扩展点编码',
    point_name      VARCHAR(200) NOT NULL COMMENT '扩展点名称',
    point_type      VARCHAR(50) NOT NULL COMMENT '类型: SPI/EVENT/INTERCEPTOR/HOOK/STRATEGY',
    interface_class VARCHAR(500) NOT NULL COMMENT '接口全限定名',
    description     VARCHAR(500) COMMENT '描述',
    sort_order      INT DEFAULT 0,
    status          TINYINT DEFAULT 1,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_point_code (point_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='扩展点注册表';

CREATE TABLE sys_extension_impl (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    point_id        BIGINT NOT NULL COMMENT '扩展点ID',
    impl_code       VARCHAR(100) NOT NULL COMMENT '实现编码',
    impl_name       VARCHAR(200) NOT NULL COMMENT '实现名称',
    impl_class      VARCHAR(500) NOT NULL COMMENT '实现类全限定名',
    impl_order      INT DEFAULT 0 COMMENT '执行顺序',
    enabled         TINYINT DEFAULT 1 COMMENT '是否启用',
    config          JSON COMMENT '实现配置',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_impl_code (point_id, impl_code),
    KEY idx_point_id (point_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='扩展点实现表';
```

#### 扩展点管理 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/extension/point/list | 扩展点列表 |
| GET | /api/extension/point/{code} | 扩展点详情（含所有实现） |
| POST | /api/extension/point | 注册扩展点 |
| GET | /api/extension/impl/list?pointCode={code} | 扩展点的所有实现 |
| POST | /api/extension/impl | 注册扩展点实现 |
| PUT | /api/extension/impl/{id} | 更新实现配置 |
| PUT | /api/extension/impl/{id}/toggle | 启用/禁用实现 |
| DELETE | /api/extension/impl/{id} | 删除实现 |

#### SPI 扩展点示例

```java
// 1. 定义扩展点接口
public interface LoginExtension {
    /** 登录前校验 */
    void beforeLogin(LoginContext context);
    /** 登录后处理 */
    void afterLogin(LoginContext context, UserDO user);
}

// 2. 注册扩展点
@Component
public class LoginExtensionPoint extends AbstractExtensionPoint<LoginExtension> {
    @Override
    public String getPointCode() {
        return "auth.login";
    }
}

// 3. 业务模块实现扩展点
@Component
public class LoginLogExtension implements LoginExtension {
    @Override
    public void beforeLogin(LoginContext context) {
        // 记录登录尝试
    }
    @Override
    public void afterLogin(LoginContext context, UserDO user) {
        // 记录登录成功日志
    }
}

// 4. 在核心代码中触发扩展点
public void login(String username, String password) {
    LoginContext context = new LoginContext(username);
    extensionManager.trigger("auth.login", ext -> ext.beforeLogin(context));
    // ... 核心登录逻辑 ...
    extensionManager.trigger("auth.login", ext -> ext.afterLogin(context, user));
}
```

#### 事件扩展点示例

```java
// 1. 定义事件
@Data
public class UserCreatedEvent {
    private Long userId;
    private String username;
}

// 2. 发布事件
@Service
public class UserServiceImpl {
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public void createUser(CreateUserCommand cmd) {
        // ... 创建用户 ...
        eventPublisher.publishEvent(new UserCreatedEvent(userId, username));
    }
}

// 3. 监听事件（可扩展）
@Component
public class UserCreatedListener implements ApplicationListener<UserCreatedEvent> {
    @Override
    public void onApplicationEvent(UserCreatedEvent event) {
        // 初始化用户配置、发送欢迎邮件等
    }
}
```

#### 拦截器扩展点示例

```java
// API 拦截器链
public interface ApiInterceptor extends HandlerInterceptor {
    int getOrder();  // 执行顺序
}

// 使用
@Component
public class ApiLogInterceptor implements ApiInterceptor {
    @Override
    public int getOrder() { return 100; }

    @Override
    public boolean preHandle(HttpServletRequest request, ...) {
        // 记录请求日志
        return true;
    }
}
```

#### 策略扩展点示例

```java
// 文件存储策略
public interface FileStorageStrategy {
    String store(MultipartFile file);
    byte[] load(String fileUrl);
    void delete(String fileUrl);
}

// 内置实现
@Component("localFileStorage")
public class LocalFileStorage implements FileStorageStrategy { ... }

@Component("ossFileStorage")
public class OssFileStorage implements FileStorageStrategy { ... }

// 使用（可运行时切换）
@Service
public class FileServiceImpl {
    @Autowired
    private ExtensionManager extensionManager;

    public String storeFile(MultipartFile file) {
        FileStorageStrategy strategy = extensionManager.getStrategy(
            "file.storage", FileStorageStrategy.class
        );
        return strategy.store(file);
    }
}
```

---

| 通信方式 | 场景 | 实现 |
|---------|------|------|
| **全局状态** | 用户信息、权限数据、字典缓存 | Qiankun `initGlobalState` / `onGlobalStateChange` |
| **自定义事件** | 跨子应用通知（如数据刷新） | `window.dispatchEvent` + 类型安全封装 |
| **URL 通信** | 跨子应用跳转、参数传递 | 路由 query/hash 参数 |
| **Shared Module** | 公共组件、工具函数 | npm 私有包 + 版本管理 |

### 3.4 子应用接入规范

每个子应用必须：

1. **导出生命周期函数**：`bootstrap`、`mount`、`unmount`
2. **独立开发/构建/部署**：`package.json` 中配置 `name`、`devServer.port`
3. **遵循统一 UI 规范**：使用共享的 Ant Design 主题包和组件库
4. **暴露注册信息**：在主应用的子应用注册表中声明路由和容器

---

## 4. 非功能性需求

### 4.1 性能

| 指标 | 要求 |
|------|------|
| 页面首屏加载 | ≤ 2s（子应用懒加载后） |
| API 平均响应时间 | ≤ 200ms（P95 ≤ 500ms） |
| 并发用户数 | ≥ 500（单节点） |
| 数据库查询 | 单表查询 ≤ 50ms，复杂查询 ≤ 200ms |
| 子应用切换 | ≤ 500ms（预加载后） |
| 文件上传 | 支持 100MB+ 文件分片上传 |

### 4.2 安全

| 类别 | 要求 |
|------|------|
| 认证 | JWT + Refresh Token，Token 有效期可配置 |
| 传输安全 | 全站 HTTPS，TLS 1.3 |
| 数据安全 | 敏感数据加密存储（AES-256），日志脱敏 |
| SQL 注入 | MyBatis 参数化查询，禁止字符串拼接 |
| XSS 防护 | 前端输出编码 + CSP 策略 |
| CSRF 防护 | SameSite Cookie + Token 验证 |
| 接口安全 | 接口签名（可选）、请求频率限制、IP 黑白名单 |
| 审计合规 | 关键操作全量审计日志，不可篡改 |

### 4.3 可扩展性

| 维度 | 要求 |
|------|------|
| 模块扩展 | 新业务模块通过标准化接口接入，无需修改核心代码 |
| 数据库扩展 | 支持读写分离、分库分表（预留中间件接入点） |
| 缓存扩展 | Redis Cluster 支持，缓存策略可配置 |
| 水平扩展 | 无状态设计，支持 Kubernetes HPA 自动扩缩容 |
| 多租户 | 架构层面预留租户隔离能力（数据源路由 + 租户上下文） |
| 国际化 | 前后端 i18n 支持，语言包可扩展 |

### 4.4 可维护性

| 维度 | 要求 |
|------|------|
| 代码规范 | 后端遵循阿里巴巴 Java 开发手册，前端 ESLint + Prettier |
| 单元测试 | 核心模块覆盖率 ≥ 80% |
| API 文档 | SpringDoc OpenAPI 3.0 自动生成，Swagger UI 可访问 |
| CI/CD | GitHub Actions / GitLab CI，自动化构建、测试、部署 |
| 监控告警 | Prometheus + Grafana，关键指标告警 |

### 4.5 可用性

| 指标 | 要求 |
|------|------|
| 可用性 | ≥ 99.9%（年停机时间 ≤ 8.76h） |
| 数据备份 | 每日全量 + 实时 binlog 增量 |
| 故障恢复 | RTO ≤ 30min，RPO ≤ 5min |
| 灰度发布 | 支持滚动更新，零停机部署 |

---

## 5. 模块优先级排序

### 5.1 优先级定义

| 等级 | 定义 | 交付时间 |
|------|------|---------|
| **P0** | 核心基础，系统运行的最低要求 | Sprint 1-3（第 1-6 周） |
| **P1** | 重要功能，提升开发效率和运维能力 | Sprint 4-6（第 7-12 周） |
| **P2** | 增强功能，按需交付 | Sprint 7-9（第 13-18 周） |

### 5.2 优先级排序

```
P0（必须交付）— Sprint 1-3
├── ✅ 认证与用户管理（Auth & User）
├── ✅ 权限管理（Permission / RBAC4）
├── ✅ 数据字典管理（Dictionary）
├── ✅ 日志管理（Logging / Audit）
├── ✅ 主应用框架（Shell + 路由 + 布局）
└── ✅ 基础设施（数据库、Redis、统一异常处理、统一响应）

P1（重要功能）— Sprint 4-6
├── 🔧 API 网关（API Gateway）
├── 🔧 代码生成器（Code Generator）
├── 🔧 系统监控（Monitor）
└── 🔧 多租户基础支持

P2（增强功能）— Sprint 7-9
├── 📦 文件管理（File Storage）
├── 📦 定时任务（Scheduler）
├── 📦 消息通知（Notification）
└── 📦 业务模块示例（Demo Module）
```

### 5.3 里程碑规划

| 里程碑 | 时间 | 交付物 |
|--------|------|--------|
| **M1 — 基础可运行** | 第 6 周 | 用户登录、权限控制、字典管理、日志记录，可支撑一个简单 CRUD 业务 |
| **M2 — 开发提效** | 第 12 周 | API 网关、代码生成器、系统监控，新模块接入效率提升 50%+ |
| **M3 — 功能完善** | 第 18 周 | 文件管理、定时任务、消息通知，平台功能完整可用 |
| **M4 — 生产就绪** | 第 20 周 | 性能压测、安全审计、文档完善、部署文档 |

---

## 附录

### A. 技术栈详细清单

| 层级 | 技术 | 版本 |
|------|------|------|
| 后端框架 | Spring Boot | 4.x |
| JDK | OpenJDK | 25 |
| ORM | MyBatis-Plus | 最新稳定版 |
| 数据库 | MySQL | 8.0+ |
| 缓存 | Redis | 7.x |
| API 文档 | SpringDoc OpenAPI | 最新稳定版 |
| 前端框架 | React | 18.x |
| UI 组件库 | Ant Design | 5.x |
| 微前端 | Qiankun | 2.x |
| 构建工具 | Vite / Webpack | 最新稳定版 |
| 包管理 | pnpm | 最新稳定版 |
| 网关 | Spring Cloud Gateway | 与 Boot 4.x 匹配 |
| 容器化 | Docker + Kubernetes | 最新稳定版 |

### B. 后端模块结构（Maven 多模块）

```
zephyr/
├── base-common/           # 公共模块（工具类、常量、异常、通用配置）
├── base-auth/             # 认证模块
├── base-system/           # 系统管理（用户、部门、岗位）
├── base-permission/       # 权限管理
├── base-dict/             # 数据字典
├── base-log/              # 日志管理
├── base-gateway/          # API 网关
├── base-monitor/          # 系统监控
├── base-codegen/          # 代码生成器
├── base-file/             # 文件管理
├── base-job/              # 定时任务
├── base-notification/     # 消息通知
├── base-plugin/           # 插件加载框架
└── base-admin/            # 管理后台启动模块（聚合启动）
```

### C. 前端模块结构

```
zephyr-web/
├── main-app/              # 主应用（Shell）
├── sub-system/            # 系统管理子应用
├── sub-permission/        # 权限管理子应用
├── sub-dict/              # 数据字典子应用
├── sub-log/               # 日志管理子应用
├── sub-monitor/           # 系统监控子应用
├── sub-codegen/           # 代码生成器子应用
├── sub-file/              # 文件管理子应用
├── sub-job/               # 定时任务子应用
├── sub-notification/      # 消息通知子应用
├── shared/                # 共享组件库
│   ├── components/        # 通用业务组件
│   ├── hooks/             # 公共 Hooks
│   ├── utils/             # 工具函数
│   └── theme/             # 主题配置
└── shared-package/        # npm 私有包（@zephyr/shared）
```

---

*文档结束*
