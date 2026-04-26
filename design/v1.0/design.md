# 多模块基础系统 — 技术设计文档

> **版本：** v1.0  
> **日期：** 2026-04-24  
> **基于：** PRD v1.0

---

## 1. 技术栈确认

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| JDK | OpenJDK | 25 | LTS，虚拟线程支持 |
| 后端框架 | Spring Boot | 4.x | 最新 GA |
| ORM | Fluent-MyBatis | 1.6.x | 编译期生成类型安全 SQL，零反射 |
| 数据库 | MySQL | 8.0+ | 主存储 |
| 缓存 | Redis | 7.x | 会话、权限缓存、字典缓存 |
| API 文档 | SpringDoc OpenAPI | 2.x | Swagger UI |
| 网关 | Spring Cloud Gateway | 4.x | 与 Boot 4.x 匹配 |
| 认证 | Sa-Token | 1.39.x | 轻量级，比 Spring Security 简单 |
| 前端框架 | React | 18.x | |
| UI 组件库 | Ant Design | 5.x | |
| 微前端 | Qiankun | 2.x | |
| 构建工具 | Vite | 5.x | 快速构建 |
| 包管理 | pnpm | 9.x | monorepo 支持 |
| 语言 | TypeScript | 5.x | 前端 |
| 插件化 | 自研 Plugin Framework | - | 模块注册/加载/卸载 |
| 国际化 | i18next + Spring MessageSource | - | 前后端多语言支持 |

---

## 2. 后端架构：COLA 分层

### 2.1 COLA 架构概览

采用阿里巴巴 COLA（Clean Object-oriented & Layered Architecture）架构，按业务域划分模块，每个模块内部遵循四层分层：

```
┌─────────────────────────────────────────────────────────┐
│                    base-admin（启动层）                    │
│              Spring Boot Application 入口                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │          adapter（接口层）                        │   │
│  │    Controller / DTO / 参数校验 / 路由            │   │
│  ├─────────────────────────────────────────────────┤   │
│  │           app（应用层）                           │   │
│  │    Command / Query / 业务编排 / 事务管理          │   │
│  ├─────────────────────────────────────────────────┤   │
│  │          domain（领域层）                         │   │
│  │    领域模型 / 领域服务 / 仓储接口 / 领域事件      │   │
│  ├─────────────────────────────────────────────────┤   │
│  │       infrastructure（基础设施层）                 │   │
│  │    仓储实现 / MyBatis Mapper / 外部服务 / MQ      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  业务模块：auth / system / permission / dict / log ...  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 模块依赖规则

```
adapter ──依赖──▶ app ──依赖──▶ domain
                                │
app ──依赖──▶ infrastructure ──依赖──▶ domain

✅ adapter 可以依赖 app 和 infrastructure
✅ app 可以依赖 domain 和 infrastructure
✅ domain 不依赖任何其他层（最内层，纯领域逻辑）
✅ infrastructure 实现 domain 中定义的仓储接口
```

### 2.3 端点（应用）管理

系统支持配置多个端点（应用入口），每个端点对应一个独立的访问地址和入口，可配置布局、Logo、主题等。

#### 端点概念

```
https://admin.baseplatform.com          → 端点1: 管理后台（默认）
https://crm.baseplatform.com            → 端点2: CRM 系统
https://erp.baseplatform.com            → 端点3: ERP 系统
https://monitor.baseplatform.com        → 端点4: 运维监控
```

每个端点可以：
- 绑定独立的域名或路径前缀
- 配置独立的 Logo、标题、主题色
- 选择不同的布局模板
- 指定可见的模块和菜单
- 配置登录页样式

#### 端点数据模型

```sql
CREATE TABLE sys_endpoint (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    code            VARCHAR(50) NOT NULL COMMENT '端点编码（唯一标识）',
    name            VARCHAR(100) NOT NULL COMMENT '端点名称',
    description     VARCHAR(500) COMMENT '描述',
    -- 访问配置
    domain          VARCHAR(200) COMMENT '绑定域名（如 crm.baseplatform.com）',
    path_prefix     VARCHAR(100) COMMENT '路径前缀（如 /crm）',
    entry_url       VARCHAR(500) COMMENT '入口页面 URL',
    -- 品牌配置
    logo            VARCHAR(500) COMMENT 'Logo 图片 URL',
    favicon         VARCHAR(500) COMMENT 'Favicon URL',
    title           VARCHAR(200) COMMENT '浏览器标题',
    copyright       VARCHAR(200) COMMENT '版权信息',
    -- 布局配置
    layout          VARCHAR(50) DEFAULT 'basic' COMMENT '布局模板: basic/blank/sidebar-top/mixed',
    theme           VARCHAR(20) DEFAULT 'light' COMMENT '主题: light/dark/auto',
    primary_color   VARCHAR(20) DEFAULT '#1677ff' COMMENT '主题色',
    -- 登录页配置
    login_bg        VARCHAR(500) COMMENT '登录页背景图',
    login_title     VARCHAR(200) COMMENT '登录页标题',
    login_subtitle  VARCHAR(500) COMMENT '登录页副标题',
    -- 模块可见性（JSON 数组，控制该端点显示哪些模块）
    visible_modules TEXT COMMENT '["system","permission","dict"]',
    -- 状态
    status          TINYINT DEFAULT 1 COMMENT '1启用 0禁用',
    sort_order      INT DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT DEFAULT 0,
    UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='端点（应用）配置表';
```

#### 端点管理 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/endpoint/list | 端点列表 |
| GET | /api/endpoint/{code} | 获取端点配置（前端启动时拉取） |
| POST | /api/endpoint | 新增端点 |
| PUT | /api/endpoint/{id} | 更新端点配置 |
| DELETE | /api/endpoint/{id} | 删除端点 |
| PUT | /api/endpoint/{id}/status | 启用/禁用端点 |

#### 前端端点加载流程

```
用户访问 crm.baseplatform.com
        │
        ▼
┌─ 主应用 Shell 启动 ─────────────────────────────┐
│  1. 根据域名/路径 解析端点编码                      │
│  2. GET /api/endpoint/{code} 获取端点配置           │
│  3. 应用 Logo、标题、主题色                         │
│  4. 根据 visible_modules 过滤菜单和模块              │
│  5. 加载对应的布局模板                              │
│  6. 动态注册该端点可见的子应用                       │
│  7. 渲染页面                                      │
└──────────────────────────────────────────────────┘
```

```typescript
// 前端端点配置类型
interface EndpointConfig {
    code: string;
    name: string;
    domain?: string;
    pathPrefix?: string;
    entryUrl?: string;
    logo?: string;
    favicon?: string;
    title?: string;
    copyright?: string;
    layout: 'basic' | 'blank' | 'sidebar-top' | 'mixed';
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    loginBg?: string;
    loginTitle?: string;
    loginSubtitle?: string;
    visibleModules: string[];
}

// 主应用根据端点配置动态渲染
function App() {
    const { endpoint } = useEndpoint(); // 从全局状态获取

    return (
        <ConfigProvider theme={{ token: { colorPrimary: endpoint.primaryColor } }}>
            <Layout template={endpoint.layout}>
                <Logo src={endpoint.logo} title={endpoint.title} />
                <Sidebar modules={endpoint.visibleModules} />
                <Content />
            </Layout>
        </ConfigProvider>
    );
}
```

### 2.4 业务模块划分

每个业务域（如 system、permission、dict）包含完整的 COLA 四层：

```
zephyr/
├── base-common/                    # 公共基础（工具类、常量、异常、通用配置）
│
├── base-system/                    # 系统管理域
│   ├── base-system-adapter/         #   接口层：Controller、DTO
│   ├── base-system-app/             #   应用层：UserAppService、Command/Query
│   ├── base-system-domain/          #   领域层：User、Dept、Post 聚合根
│   └── base-system-infrastructure/  #   基础设施层：UserMapper、UserRepositoryImpl
│
├── base-auth/                      # 认证域
│   ├── base-auth-adapter/
│   ├── base-auth-app/
│   ├── base-auth-domain/
│   └── base-auth-infrastructure/
│
├── base-permission/                # 权限域
│   ├── base-permission-adapter/
│   ├── base-permission-app/
│   ├── base-permission-domain/
│   └── base-permission-infrastructure/
│
├── base-dict/                      # 字典域
│   ├── base-dict-adapter/
│   ├── base-dict-app/
│   ├── base-dict-domain/
│   └── base-dict-infrastructure/
│
├── base-log/                       # 日志域
│   ├── base-log-adapter/
│   ├── base-log-app/
│   ├── base-log-domain/
│   └── base-log-infrastructure/
│
├── base-gateway/                   # API 网关（独立 Spring Boot 应用）
├── base-monitor/                   # 系统监控
├── base-codegen/                   # 代码生成器
├── base-file/                      # 文件管理
├── base-job/                       # 定时任务
├── base-notification/              # 消息通知
├── base-plugin/                    # 插件加载框架
│
└── base-admin/                     # 聚合启动模块
```

### 2.4 各层职责详解

| 层 | artifactId 后缀 | 职责 | 允许依赖 |
|---|---|---|---|
| **adapter** | -adapter | 接收请求、参数校验、DTO 转换、调用 app 层 | app, infrastructure |
| **app** | -app | 业务编排、事务管理、调用 domain 服务 | domain, infrastructure |
| **domain** | -domain | 领域模型、领域服务、仓储接口定义 | 无（纯领域） |
| **infrastructure** | -infrastructure | 仓储实现、Mapper、外部服务适配 | domain |

### 2.5 核心类命名规范

| 类型 | 命名规范 | 示例 |
|------|---------|------|
| Controller | {Entity}Controller | UserController |
| DTO（请求） | {Action}{Entity}Command | CreateUserCommand |
| DTO（响应） | {Entity}VO | UserVO |
| App Service | {Entity}AppService | UserAppService |
| Domain Service | {Entity}Service | UserService |
| 聚合根 | {Entity} | User |
| 领域对象 | {Entity}DO 或值对象 | UserProfile |
| 仓储接口 | {Entity}Repository | UserRepository |
| 仓储实现 | {Entity}RepositoryImpl | UserRepositoryImpl |
| Mapper | {Entity}Mapper | UserMapper |

### 2.6 根 POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>4.0.0</version>
    </parent>

    <groupId>com.baseplatform</groupId>
    <artifactId>zephyr</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>
    <name>Zephyr</name>

    <modules>
        <!-- 公共基础 -->
        <module>base-common</module>

        <!-- 系统管理域 -->
        <module>base-system-adapter</module>
        <module>base-system-app</module>
        <module>base-system-domain</module>
        <module>base-system-infrastructure</module>

        <!-- 认证域 -->
        <module>base-auth-adapter</module>
        <module>base-auth-app</module>
        <module>base-auth-domain</module>
        <module>base-auth-infrastructure</module>

        <!-- 权限域 -->
        <module>base-permission-adapter</module>
        <module>base-permission-app</module>
        <module>base-permission-domain</module>
        <module>base-permission-infrastructure</module>

        <!-- 字典域 -->
        <module>base-dict-adapter</module>
        <module>base-dict-app</module>
        <module>base-dict-domain</module>
        <module>base-dict-infrastructure</module>

        <!-- 日志域 -->
        <module>base-log-adapter</module>
        <module>base-log-app</module>
        <module>base-log-domain</module>
        <module>base-log-infrastructure</module>

        <!-- 独立模块 -->
        <module>base-gateway</module>
        <module>base-monitor</module>
        <module>base-codegen</module>
        <module>base-file</module>
        <module>base-job</module>
        <module>base-notification</module>
        <module>base-plugin</module>

        <!-- 启动模块 -->
        <module>base-admin</module>
    </modules>

    <properties>
        <java.version>25</java.version>
        <mybatis-fluent.version>1.6.4</mybatis-fluent.version>
        <sa-token.version>1.39.0</sa-token.version>
        <springdoc.version>2.6.0</springdoc.version>
        <hutool.version>5.8.28</hutool.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.baseplatform</groupId>
                <artifactId>base-common</artifactId>
                <version>${project.version}</version>
            </dependency>
            <!-- 各域的 domain 模块 -->
            <dependency>
                <groupId>com.baseplatform</groupId>
                <artifactId>base-system-domain</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.baseplatform</groupId>
                <artifactId>base-auth-domain</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.baseplatform</groupId>
                <artifactId>base-permission-domain</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.baseplatform</groupId>
                <artifactId>base-dict-domain</artifactId>
                <version>${project.version}</version>
            </dependency>
            <dependency>
                <groupId>com.baseplatform</groupId>
                <artifactId>base-log-domain</artifactId>
                <version>${project.version}</version>
            </dependency>
            <!-- Fluent-MyBatis -->
            <dependency>
                <groupId>com.github.yingzhuo</groupId>
                <artifactId>fluent-mybatis</artifactId>
                <version>${mybatis-fluent.version}</version>
            </dependency>
            <!-- Sa-Token -->
            <dependency>
                <groupId>cn.dev33</groupId>
                <artifactId>sa-token-spring-boot3-starter</artifactId>
                <version>${sa-token.version}</version>
            </dependency>
            <!-- SpringDoc -->
            <dependency>
                <groupId>org.springdoc</groupId>
                <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
                <version>${springdoc.version}</version>
            </dependency>
            <!-- Hutool -->
            <dependency>
                <groupId>cn.hutool</groupId>
                <artifactId>hutool-all</artifactId>
                <version>${hutool.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```

### 2.7 单个域的 POM 示例（base-system）

```xml
<!-- base-system/pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.baseplatform</groupId>
    <artifactId>base-system</artifactId>
    <packaging>pom</packaging>
    <name>Base System</name>
    <modules>
        <module>base-system-adapter</module>
        <module>base-system-app</module>
        <module>base-system-domain</module>
        <module>base-system-infrastructure</module>
    </modules>
</project>

<!-- base-system-domain/pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.baseplatform</groupId>
        <artifactId>zephyr</artifactId>
    </parent>
    <artifactId>base-system-domain</artifactId>
    <name>System Domain</name>
    <dependencies>
        <dependency>
            <groupId>com.baseplatform</groupId>
            <artifactId>base-common</artifactId>
        </dependency>
    </dependencies>
</project>

<!-- base-system-infrastructure/pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.baseplatform</groupId>
        <artifactId>zephyr</artifactId>
    </parent>
    <artifactId>base-system-infrastructure</artifactId>
    <name>System Infrastructure</name>
    <dependencies>
        <dependency>
            <groupId>com.baseplatform</groupId>
            <artifactId>base-system-domain</artifactId>
        </dependency>
        <dependency>
            <groupId>com.github.yingzhuo</groupId>
            <artifactId>fluent-mybatis</artifactId>
        </dependency>
    </dependencies>
</project>

<!-- base-system-app/pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.baseplatform</groupId>
        <artifactId>zephyr</artifactId>
    </parent>
    <artifactId>base-system-app</artifactId>
    <name>System App</name>
    <dependencies>
        <dependency>
            <groupId>com.baseplatform</groupId>
            <artifactId>base-system-domain</artifactId>
        </dependency>
        <dependency>
            <groupId>com.baseplatform</groupId>
            <artifactId>base-system-infrastructure</artifactId>
        </dependency>
    </dependencies>
</project>

<!-- base-system-adapter/pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.baseplatform</groupId>
        <artifactId>zephyr</artifactId>
    </parent>
    <artifactId>base-system-adapter</artifactId>
    <name>System Adapter</name>
    <dependencies>
        <dependency>
            <groupId>com.baseplatform</groupId>
            <artifactId>base-system-app</artifactId>
        </dependency>
    </dependencies>
</project>
```

### 2.8 模块注册 / 加载 / 卸载机制

系统支持模块的动态注册、加载和卸载，实现真正的插件化架构。

#### 2.8.1 模块生命周期

```
                  ┌──────────┐
                  │  已注册   │  ← registerModule() 注册元数据
                  └────┬─────┘
                       │
                  loadModule()
                       │
                  ┌────▼─────┐
                  │  已加载   │  ← Spring Bean 初始化、路由注册、菜单注入
                  └────┬─────┘
                       │
                  unloadModule()
                       │
                  ┌────▼─────┐
                  │  已卸载   │  ← Bean 销毁、路由移除、缓存清理
                  └──────────┘
```

#### 2.8.2 模块元数据（Plugin Descriptor）

```java
@Data
public class ModuleDescriptor {
    private String moduleId;          // 模块唯一标识，如 "system"
    private String name;              // 模块名称
    private String version;           // 版本号
    private String description;       // 模块描述
    private ModuleType type;          // CORE / STANDARD / CUSTOM
    private String entryClass;        // 主配置类全限定名
    private List<String> depends;     // 依赖的其他模块
    private List<String> permissions; // 模块提供的权限标识
    private Map<String, String> config; // 模块自定义配置
    private ModuleStatus status;      // 当前状态
}

public enum ModuleStatus {
    REGISTERED,   // 已注册（元数据已入库，未加载）
    LOADING,      // 加载中
    ACTIVE,       // 已加载（运行中）
    UNLOADING,    // 卸载中
    UNLOADED,     // 已卸载
    ERROR         // 异常
}

public enum ModuleType {
    CORE,       // 核心模块（不可卸载，如 auth、system）
    STANDARD,   // 标准模块（可卸载，如 dict、log）
    CUSTOM      // 自定义业务模块
}
```

#### 2.8.3 模块注册表（Module Registry）

```java
@Component
@Slf4j
public class ModuleRegistry {

    private final Map<String, ModuleDescriptor> modules = new ConcurrentHashMap<>();
    private final Map<String, Object> moduleBeans = new ConcurrentHashMap<>();

    @Autowired
    private ModuleStorage moduleStorage;  // 持久化存储

    /**
     * 注册模块 — 将模块元数据写入注册表
     */
    public void register(ModuleDescriptor descriptor) {
        if (modules.containsKey(descriptor.getModuleId())) {
            throw new BusinessException("模块已注册: " + descriptor.getModuleId());
        }
        // 校验依赖
        for (String dep : descriptor.getDepends()) {
            if (!modules.containsKey(dep)) {
                throw new BusinessException("依赖模块未注册: " + dep);
            }
        }
        descriptor.setStatus(ModuleStatus.REGISTERED);
        modules.put(descriptor.getModuleId(), descriptor);
        moduleStorage.save(descriptor);
        log.info("模块注册成功: {} v{}", descriptor.getName(), descriptor.getVersion());
    }

    /**
     * 加载模块 — 初始化 Spring Bean、注册路由
     */
    public void load(String moduleId) {
        ModuleDescriptor desc = getDescriptor(moduleId);
        if (desc.getStatus() == ModuleStatus.ACTIVE) {
            log.warn("模块已加载: {}", moduleId);
            return;
        }
        // 加载依赖
        for (String dep : desc.getDepends()) {
            if (getDescriptor(dep).getStatus() != ModuleStatus.ACTIVE) {
                load(dep);
            }
        }
        desc.setStatus(ModuleStatus.LOADING);
        try {
            // 通过 Spring Context 加载模块 Bean
            Object bean = Class.forName(desc.getEntryClass()).getDeclaredConstructor().newInstance();
            moduleBeans.put(moduleId, bean);
            desc.setStatus(ModuleStatus.ACTIVE);
            moduleStorage.updateStatus(moduleId, ModuleStatus.ACTIVE);
            log.info("模块加载成功: {}", moduleId);
        } catch (Exception e) {
            desc.setStatus(ModuleStatus.ERROR);
            log.error("模块加载失败: {}", moduleId, e);
            throw new BusinessException("模块加载失败: " + moduleId);
        }
    }

    /**
     * 卸载模块 — 销毁 Bean、清理缓存
     */
    public void unload(String moduleId) {
        ModuleDescriptor desc = getDescriptor(moduleId);
        if (desc.getType() == ModuleType.CORE) {
            throw new BusinessException("核心模块不可卸载: " + moduleId);
        }
        // 检查是否有其他模块依赖此模块
        for (ModuleDescriptor other : modules.values()) {
            if (other.getDepends().contains(moduleId) && other.getStatus() == ModuleStatus.ACTIVE) {
                throw new BusinessException("模块被依赖，无法卸载: " + other.getModuleId());
            }
        }
        desc.setStatus(ModuleStatus.UNLOADING);
        try {
            // 销毁 Bean
            moduleBeans.remove(moduleId);
            // 清理相关缓存
            // 清理路由注册
            desc.setStatus(ModuleStatus.UNLOADED);
            moduleStorage.updateStatus(moduleId, ModuleStatus.UNLOADED);
            log.info("模块卸载成功: {}", moduleId);
        } catch (Exception e) {
            desc.setStatus(ModuleStatus.ERROR);
            log.error("模块卸载失败: {}", moduleId, e);
            throw new BusinessException("模块卸载失败: " + moduleId);
        }
    }
}
```

#### 2.8.4 模块管理 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/module/list | 查看所有已注册模块 |
| GET | /api/module/{id} | 查看模块详情 |
| POST | /api/module/register | 注册新模块 |
| POST | /api/module/{id}/load | 加载模块 |
| POST | /api/module/{id}/unload | 卸载模块 |
| POST | /api/module/{id}/reload | 重新加载模块 |
| PUT | /api/module/{id}/config | 更新模块配置 |

#### 2.8.5 模块配置表

```sql
CREATE TABLE sys_module (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    module_id       VARCHAR(50) NOT NULL COMMENT '模块唯一标识',
    name            VARCHAR(100) NOT NULL COMMENT '模块名称',
    version         VARCHAR(20) NOT NULL COMMENT '版本号',
    description     VARCHAR(500) COMMENT '描述',
    type            VARCHAR(20) NOT NULL COMMENT 'CORE/STANDARD/CUSTOM',
    entry_class     VARCHAR(200) COMMENT '主配置类',
    depends         VARCHAR(500) COMMENT '依赖模块(JSON数组)',
    permissions     VARCHAR(1000) COMMENT '权限标识(JSON数组)',
    config          TEXT COMMENT '模块配置(JSON)',
    status          VARCHAR(20) DEFAULT 'REGISTERED' COMMENT '状态',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_module_id (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='模块注册表';
```

#### 2.8.6 前端动态微前端注册

```typescript
// qiankun/dynamicApps.ts
import { registerMicroApps, start } from 'qiankun';

/**
 * 从后端拉取已加载的子应用列表，动态注册
 */
export async function loadMicroApps() {
    const { data: modules } = await request.get('/api/module/list?type=FRONTEND&status=ACTIVE');

    const apps = modules.map(mod => ({
        name: mod.moduleId,
        entry: mod.config.entryUrl,        // 子应用入口 URL
        container: '#sub-app-container',
        activeRule: mod.config.routePrefix, // 路由前缀
        props: {
            token: getToken(),
            baseUrl: API_BASE,
            moduleId: mod.moduleId,
        },
    }));

    registerMicroApps(apps, {
        beforeLoad: (app) => console.log('加载子应用:', app.name),
        beforeMount: (app) => console.log('挂载子应用:', app.name),
    });

    start({ prefetch: 'all', sandbox: { strictStyleIsolation: false } });
}

/**
 * 动态添加子应用（模块热加载）
 */
export function addMicroApp(appConfig) {
    registerMicroApps([appConfig], {
        beforeLoad: () => {},
        beforeMount: () => {},
    });
}

/**
 * 动态移除子应用（模块卸载）
 */
export function removeMicroApp(appName: string) {
    // qiankun 2.x 不直接支持 unregisterMicroApps
    // 通过 activeRule 控制路由匹配即可
    // 卸载时将 activeRule 设为永不匹配的路径
}
```

### 2.9 base-admin 启动模块

```xml
<!-- base-admin/pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.baseplatform</groupId>
        <artifactId>zephyr</artifactId>
    </parent>
    <artifactId>base-admin</artifactId>
    <name>Base Admin</name>
    <dependencies>
        <!-- 聚合所有域的 adapter 层 -->
        <dependency>
            <groupId>com.baseplatform</groupId>
            <artifactId>base-system-adapter</artifactId>
        </dependency>
        <dependency>
            <groupId>com.baseplatform</groupId>
            <artifactId>base-auth-adapter</artifactId>
        </dependency>
        <dependency>
            <groupId>com.baseplatform</groupId>
            <artifactId>base-permission-adapter</artifactId>
        </dependency>
        <dependency>
            <groupId>com.baseplatform</groupId>
            <artifactId>base-dict-adapter</artifactId>
        </dependency>
        <dependency>
            <groupId>com.baseplatform</groupId>
            <artifactId>base-log-adapter</artifactId>
        </dependency>
        <!-- Spring Boot 启动器 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2.3 各模块职责

| 模块 | artifactId | 职责 |
|------|-----------|------|
| 公共模块 | base-common | 工具类、常量、统一响应体、统一异常、通用配置 |
| 认证模块 | base-auth | 登录、注册、Token 管理、OAuth2 |
| 系统管理 | base-system | 用户、部门、岗位 CRUD |
| 权限管理 | base-permission | RBAC4 角色继承、组织层级权限、数据权限 |
| 数据字典 | base-dict | 字典类型和数据管理 |
| 日志管理 | base-log | 操作日志、登录日志、AOP 切面 |
| API 网关 | base-gateway | 路由、限流、鉴权（独立应用） |
| 系统监控 | base-monitor | 健康检查、JVM、在线用户 |
| 代码生成 | base-codegen | 读取表结构、模板生成代码 |
| 文件管理 | base-file | 上传、存储、预览 |
| 定时任务 | base-job | Cron 任务管理 |
| 消息通知 | base-notification | 站内信、邮件、Webhook |
| 插件框架 | base-plugin | 插件加载、扩展点注册 |
| 启动模块 | base-admin | 聚合所有模块，Spring Boot 启动入口 |

---

## 3. 数据库设计

### 3.1 核心表 DDL

```sql
-- ============================================
-- 租户表
-- ============================================
CREATE TABLE sys_tenant (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL COMMENT '租户名称',
    contact_name    VARCHAR(50) COMMENT '联系人',
    contact_phone   VARCHAR(20) COMMENT '联系电话',
    status          TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
    expire_time     DATETIME COMMENT '过期时间',
    account_limit   INT DEFAULT 100 COMMENT '用户数上限',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT DEFAULT 0,
    UNIQUE KEY uk_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='租户表';

-- ============================================
-- 用户表
-- ============================================
CREATE TABLE sys_user (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id       BIGINT NOT NULL DEFAULT 1 COMMENT '租户ID',
    username        VARCHAR(50) NOT NULL COMMENT '用户名',
    password        VARCHAR(200) NOT NULL COMMENT '密码(BCrypt)',
    nickname        VARCHAR(50) COMMENT '昵称',
    email           VARCHAR(100) COMMENT '邮箱',
    phone           VARCHAR(20) COMMENT '手机号',
    avatar          VARCHAR(500) COMMENT '头像URL',
    gender          TINYINT DEFAULT 0 COMMENT '性别 0未知 1男 2女',
    status          TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
    login_ip        VARCHAR(50) COMMENT '最后登录IP',
    login_time      DATETIME COMMENT '最后登录时间',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT DEFAULT 0,
    UNIQUE KEY uk_username_tenant (username, tenant_id),
    KEY idx_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ============================================
-- 部门表
-- ============================================
CREATE TABLE sys_dept (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id       BIGINT NOT NULL DEFAULT 1,
    parent_id       BIGINT DEFAULT 0 COMMENT '父部门ID',
    name            VARCHAR(100) NOT NULL COMMENT '部门名称',
    sort_order      INT DEFAULT 0 COMMENT '排序',
    leader          VARCHAR(50) COMMENT '负责人',
    phone           VARCHAR(20) COMMENT '联系电话',
    status          TINYINT DEFAULT 1,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT DEFAULT 0,
    KEY idx_parent (parent_id),
    KEY idx_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- ============================================
-- 角色表
-- ============================================
CREATE TABLE sys_role (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id       BIGINT NOT NULL DEFAULT 1,
    name            VARCHAR(50) NOT NULL COMMENT '角色名称',
    code            VARCHAR(50) NOT NULL COMMENT '角色编码',
    parent_role_id  BIGINT DEFAULT 0 COMMENT '父角色ID（RBAC4 角色继承）',
    sort_order      INT DEFAULT 0,
    data_scope      TINYINT DEFAULT 1 COMMENT '数据范围 1全部 2本部门 3本部门及下级 4仅本人',
    org_id          BIGINT COMMENT '绑定组织ID（RBAC4 组织层级权限）',
    status          TINYINT DEFAULT 1,
    remark          VARCHAR(500) COMMENT '备注',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT DEFAULT 0,
    UNIQUE KEY uk_code_tenant (code, tenant_id),
    KEY idx_parent_role (parent_role_id),
    KEY idx_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表（RBAC4）';

-- ============================================
-- 菜单/权限表
-- ============================================
CREATE TABLE sys_menu (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id       BIGINT DEFAULT 0 COMMENT '父菜单ID',
    name            VARCHAR(100) NOT NULL COMMENT '菜单名称',
    path            VARCHAR(200) COMMENT '路由路径',
    component       VARCHAR(200) COMMENT '前端组件路径',
    icon            VARCHAR(100) COMMENT '图标',
    type            TINYINT NOT NULL COMMENT '类型 1目录 2菜单 3按钮',
    permission      VARCHAR(100) COMMENT '权限标识 如 system:user:list',
    sort_order      INT DEFAULT 0,
    visible         TINYINT DEFAULT 1 COMMENT '是否可见',
    status          TINYINT DEFAULT 1,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单权限表';

-- ============================================
-- 用户角色关联
-- ============================================
CREATE TABLE sys_user_role (
    user_id         BIGINT NOT NULL,
    role_id         BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- ============================================
-- 角色菜单关联
-- ============================================
CREATE TABLE sys_role_menu (
    role_id         BIGINT NOT NULL,
    menu_id         BIGINT NOT NULL,
    PRIMARY KEY (role_id, menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- ============================================
-- 字典类型
-- ============================================
CREATE TABLE sys_dict_type (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL COMMENT '字典名称',
    code            VARCHAR(100) NOT NULL COMMENT '字典编码',
    status          TINYINT DEFAULT 1,
    remark          VARCHAR(500),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典类型表';

-- ============================================
-- 字典数据
-- ============================================
CREATE TABLE sys_dict_data (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    dict_code       VARCHAR(100) NOT NULL COMMENT '字典编码',
    label           VARCHAR(100) NOT NULL COMMENT '字典标签',
    value           VARCHAR(100) NOT NULL COMMENT '字典值',
    sort_order      INT DEFAULT 0,
    status          TINYINT DEFAULT 1,
    css_class       VARCHAR(100) COMMENT '样式属性',
    remark          VARCHAR(500),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_dict_code (dict_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典数据表';

-- ============================================
-- 操作日志
-- ============================================
CREATE TABLE sys_oper_log (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id       BIGINT DEFAULT 1,
    module          VARCHAR(50) COMMENT '操作模块',
    description     VARCHAR(500) COMMENT '操作描述',
    method          VARCHAR(200) COMMENT '请求方法',
    request_url     VARCHAR(500) COMMENT '请求URL',
    request_method  VARCHAR(10) COMMENT 'HTTP方法',
    request_params  TEXT COMMENT '请求参数',
    response_data   TEXT COMMENT '响应结果',
    operator_id     BIGINT COMMENT '操作人ID',
    operator_name   VARCHAR(50) COMMENT '操作人',
    operator_ip     VARCHAR(50) COMMENT '操作IP',
    status          TINYINT COMMENT '状态 1成功 0失败',
    error_msg       TEXT COMMENT '错误信息',
    duration        BIGINT COMMENT '耗时(ms)',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY idx_tenant_time (tenant_id, created_at),
    KEY idx_operator (operator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- ============================================
-- 登录日志
-- ============================================
CREATE TABLE sys_login_log (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id       BIGINT DEFAULT 1,
    username        VARCHAR(50) COMMENT '用户名',
    login_ip        VARCHAR(50) COMMENT '登录IP',
    login_location  VARCHAR(200) COMMENT '登录地点',
    browser         VARCHAR(100) COMMENT '浏览器',
    os              VARCHAR(100) COMMENT '操作系统',
    status          TINYINT COMMENT '状态 1成功 0失败',
    msg             VARCHAR(500) COMMENT '提示消息',
    login_time      DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY idx_tenant_time (tenant_id, login_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='登录日志表';
```

---

## 4. API 接口设计

### 4.1 RESTful 规范

| 规范 | 说明 |
|------|------|
| URL 格式 | `/api/{module}/{resource}` |
| HTTP 方法 | GET(查询) / POST(新增) / PUT(修改) / DELETE(删除) |
| 认证方式 | Header `Authorization: Bearer {token}` |
| 分页参数 | `?page=1&size=20` |
| 统一响应 | `{ code: 200, msg: "success", data: {} }` |
| 排序 | `?sort=created_at,desc` |

### 4.2 核心接口列表

#### 认证模块 `/api/auth`

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 登录 |
| POST | /api/auth/logout | 登出 |
| POST | /api/auth/refresh | 刷新 Token |
| GET | /api/auth/user-info | 获取当前用户信息 |
| PUT | /api/auth/password | 修改密码 |

#### 系统管理 `/api/system`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST/PUT/DELETE | /api/system/users | 用户 CRUD |
| GET/POST/PUT/DELETE | /api/system/depts | 部门 CRUD |
| GET/POST/PUT/DELETE | /api/system/posts | 岗位 CRUD |

#### 权限管理 `/api/permission`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST/PUT/DELETE | /api/permission/roles | 角色 CRUD |
| GET/POST/PUT/DELETE | /api/permission/menus | 菜单 CRUD |
| PUT | /api/permission/roles/{id}/menus | 分配角色菜单权限 |

#### 数据字典 `/api/dict`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST/PUT/DELETE | /api/dict/types | 字典类型 CRUD |
| GET/POST/PUT/DELETE | /api/dict/data | 字典数据 CRUD |
| GET | /api/dict/data/by-code/{code} | 按编码查询字典数据 |

#### 日志管理 `/api/log`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/log/operations | 操作日志列表 |
| GET | /api/log/logins | 登录日志列表 |

#### 前端路由

| 路由 | 页面 | 说明 |
|------|------|------|
| /endpoint | EndpointList | 端点列表 |
| /endpoint/:id | EndpointDetail | 端点配置 |

### 4.8 动态表单 `/api/form`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/form/list | 表单模板列表 |
| GET | /api/form/{formId} | 获取表单设计 |
| POST | /api/form | 创建表单模板 |
| PUT | /api/form/{formId} | 更新表单设计 |
| DELETE | /api/form/{formId} | 删除表单模板 |
| POST | /api/form/{formId}/publish | 发布表单 |
| POST | /api/form/{formId}/render | 渲染表单 |
| POST | /api/form/submit/{formId} | 提交表单数据 |
| GET | /api/form/data/{formId} | 查询表单数据 |

**动态表单数据库表：**

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

**前端路由：**

| 路由 | 页面 | 说明 |
|------|------|------|
| /form | FormList | 表单模板列表 |
| /form/design/:formId | FormDesigner | 表单设计器 |
| /form/preview/:formId | FormPreview | 表单预览 |

### 4.9 扩展点 `/api/extension`

**扩展点数据库表：**

```sql
CREATE TABLE sys_extension_point (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    point_code      VARCHAR(100) NOT NULL COMMENT '扩展点编码',
    point_name      VARCHAR(200) NOT NULL COMMENT '扩展点名称',
    point_type      VARCHAR(50) NOT NULL COMMENT 'SPI/EVENT/INTERCEPTOR/HOOK/STRATEGY',
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

**扩展点 API：**

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/extension/point/list | 扩展点列表 |
| GET | /api/extension/point/{code} | 扩展点详情 |
| POST | /api/extension/point | 注册扩展点 |
| GET | /api/extension/impl/list?pointCode={code} | 扩展点的所有实现 |
| POST | /api/extension/impl | 注册实现 |
| PUT | /api/extension/impl/{id} | 更新实现配置 |
| PUT | /api/extension/impl/{id}/toggle | 启用/禁用 |
| DELETE | /api/extension/impl/{id} | 删除实现 |

**前端路由：**

| 路由 | 页面 | 说明 |
|------|------|------|
| /extension | ExtensionList | 扩展点列表 |
| /extension/:code | ExtensionDetail | 扩展点实现管理 |

---

## 5. 前端微前端架构

### 5.1 主应用（Shell）结构

```
main-app/
├── src/
│   ├── layouts/
│   │   ├── BasicLayout.tsx        # 主布局（侧边栏+顶栏+内容区）
│   │   ├── BlankLayout.tsx        # 空布局（登录页等）
│   │   └── components/
│   │       ├── Sidebar.tsx        # 侧边栏菜单
│   │       ├── Header.tsx         # 顶栏（用户信息、通知）
│   │       └── TabsView.tsx       # 多标签页
│   ├── router/
│   │   ├── index.tsx              # 路由配置
│   │   └── guard.tsx              # 路由守卫
│   ├── store/
│   │   ├── user.ts                # 用户信息
│   │   ├── permission.ts          # 权限状态
│   │   └── app.ts                 # 应用全局状态
│   ├── qiankun/
│   │   ├── index.ts               # 微前端注册
│   │   ├── apps.ts                # 子应用配置表
│   │   └── lifeCycle.ts           # 生命周期
│   ├── utils/
│   │   ├── request.ts             # Axios 封装
│   │   ├── auth.ts                # Token 管理
│   │   └── storage.ts             # 本地存储
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

### 5.2 子应用配置表

```typescript
// qiankun/apps.ts
export const apps = [
  {
    name: 'sub-system',
    entry: '//localhost:7101',
    container: '#sub-app-container',
    activeRule: '/system',
    props: { token: getToken(), baseUrl: API_BASE },
  },
  {
    name: 'sub-permission',
    entry: '//localhost:7102',
    container: '#sub-app-container',
    activeRule: '/permission',
    props: { token: getToken(), baseUrl: API_BASE },
  },
  {
    name: 'sub-dict',
    entry: '//localhost:7103',
    container: '#sub-app-container',
    activeRule: '/dict',
    props: { token: getToken(), baseUrl: API_BASE },
  },
  {
    name: 'sub-log',
    entry: '//localhost:7104',
    container: '#sub-app-container',
    activeRule: '/log',
    props: { token: getToken(), baseUrl: API_BASE },
  },
  {
    name: 'sub-monitor',
    entry: '//localhost:7105',
    container: '#sub-app-container',
    activeRule: '/monitor',
    props: { token: getToken(), baseUrl: API_BASE },
  },
  {
    name: 'sub-codegen',
    entry: '//localhost:7106',
    container: '#sub-app-container',
    activeRule: '/codegen',
    props: { token: getToken(), baseUrl: API_BASE },
  },
];
```

### 5.3 子应用通信

```typescript
// 主应用：初始化全局状态
import { initGlobalState } from 'qiankun';

const initialState = {
  user: null,        // 当前用户信息
  permissions: [],   // 权限列表
  dictCache: {},     // 字典缓存
  theme: 'light',    // 主题
  collapsed: false,  // 侧边栏折叠
};

const actions = initGlobalState(initialState);

// 监听变化
actions.onGlobalStateChange((state, prev) => {
  console.log('全局状态变更:', state);
});

// 子应用中使用
export function mount(props) {
  const { onGlobalStateChange, setGlobalState } = props;
  onGlobalStateChange((state) => {
    // 更新子应用状态
  }, true);
}
```

### 5.4 子应用模板（每个子应用）

```
sub-xxx/
├── src/
│   ├── pages/              # 页面组件
│   ├── components/         # 本地组件
│   ├── services/           # API 调用
│   ├── store/              # 本地状态
│   ├── router.tsx          # 子应用路由
│   ├── App.tsx
│   └── main.tsx            # 导出生命周期
├── package.json            # name: 'sub-xxx', port: 710x
└── vite.config.ts
```

---

## 6. 统一基础设施

### 6.1 统一响应体（Ant Design Pro 规范）

遵循 [Ant Design Pro 请求规范](https://pro.ant.design/zh-CN/docs/request)：

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class R<T> {
    private boolean success;       // 是否成功
    private T data;                // 业务数据
    private String errorCode;      // 错误码（可选）
    private String errorMessage;   // 错误信息（可选）
    private Integer showType;      // 错误展示方式（可选）
    private long timestamp;        // 时间戳

    /** 成功响应 */
    public static <T> R<T> ok(T data) {
        R<T> r = new R<>();
        r.setSuccess(true);
        r.setData(data);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }

    public static <T> R<T> ok() {
        return ok(null);
    }

    /** 失败响应 */
    public static <T> R<T> fail(String errorMessage) {
        R<T> r = new R<>();
        r.setSuccess(false);
        r.setErrorMessage(errorMessage);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }

    public static <T> R<T> fail(String errorCode, String errorMessage) {
        R<T> r = new R<>();
        r.setSuccess(false);
        r.setErrorCode(errorCode);
        r.setErrorMessage(errorMessage);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }

    public static <T> R<T> fail(String errorCode, String errorMessage, Integer showType) {
        R<T> r = new R<>();
        r.setSuccess(false);
        r.setErrorCode(errorCode);
        r.setErrorMessage(errorMessage);
        r.setShowType(showType);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }
}
```

#### showType 错误展示方式

| 值 | 说明 |
|---|------|
| 0 | 不显示 |
| 1 | 警告提示（warning） |
| 2 | 错误提示（error） |
| 3 | 通知（notification） |
| 4 | 跳转错误页 |

#### 响应示例

```json
// 成功
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员"
  },
  "timestamp": 1776935269304
}

// 分页成功
{
  "success": true,
  "data": {
    "list": [
      { "id": 1, "username": "admin" },
      { "id": 2, "username": "user1" }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  },
  "timestamp": 1776935269304
}

// 失败
{
  "success": false,
  "errorCode": "USER_NOT_FOUND",
  "errorMessage": "用户不存在",
  "showType": 2,
  "timestamp": 1776935269304
}
```

#### 分页响应封装

```java
@Data
public class PageResult<T> {
    private List<T> list;       // 数据列表
    private long total;         // 总条数
    private int page;           // 当前页
    private int pageSize;       // 每页条数

    public static <T> PageResult<T> of(List<T> list, long total, int page, int pageSize) {
        PageResult<T> result = new PageResult<>();
        result.setList(list);
        result.setTotal(total);
        result.setPage(page);
        result.setPageSize(pageSize);
        return result;
    }
}

// 使用
R.ok(PageResult.of(list, total, page, pageSize));
```

### 6.2 统一异常处理

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public R<?> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return R.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public R<?> handleValidationException(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.joining(", "));
        return R.fail(400, msg);
    }

    @ExceptionHandler(Exception.class)
    public R<?> handleException(Exception e) {
        log.error("系统异常", e);
        return R.fail("系统内部错误");
    }
}
```

### 6.3 统一鉴权（Sa-Token）

```java
@Configuration
public class SaTokenConfig {
    @Bean
    public SaServletFilter saServletFilter() {
        return new SaServletFilter()
            .addInclude("/**")
            .addExclude("/api/auth/login", "/api/auth/register", "/doc.html", "/swagger-ui/**")
            .setAuth(obj -> {
                // Token 校验
                StpUtil.checkLogin();
                // 权限校验（如果接口有 @SaCheckPermission 注解则自动校验）
            });
    }
}
```

### 6.4 操作日志切面

```java
@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class OperLogAspect {

    private final SysOperLogService operLogService;

    @Around("@annotation(operLog)")
    public Object around(ProceedingJoinPoint joinPoint, OperLog operLog) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long duration = System.currentTimeMillis() - startTime;

        // 异步保存日志
        SysOperLog log = new SysOperLog();
        log.setModule(operLog.module());
        log.setDescription(operLog.description());
        log.setMethod(joinPoint.getSignature().toShortString());
        log.setDuration(duration);
        log.setOperatorId(StpUtil.getLoginIdAsLong());
        log.setStatus(1);
        operLogService.saveAsync(log);

        return result;
    }
}
```

---

## 7. 项目目录结构

### 7.1 后端目录（COLA 分层 + webapp 前端）

每个业务域模块包含完整的 COLA 四层 + webapp 前端子应用：

```
zephyr/
├── pom.xml                                # 根 POM
│
├── base-common/                           # 公共基础模块
│   └── src/main/java/com/baseplatform/common/
│       ├── core/
│       │   ├── domain/
│       │   │   ├── R.java                 # 统一响应体
│       │   │   └── PageResult.java        # 分页响应
│       │   ├── exception/
│       │   │   ├── BusinessException.java # 业务异常
│       │   │   └── GlobalExceptionHandler.java
│       │   └── config/
│       │       ├── FluentMyBatisConfig.java  # Fluent-MyBatis 配置
│       │       ├── RedisConfig.java
│       │       └── CorsConfig.java
│       ├── annotation/
│       │   └── OperLog.java               # 操作日志注解
│       ├── enums/
│       │   ├── StatusEnum.java
│       │   └── DataScopeEnum.java
│       └── utils/
│           ├── SecurityUtils.java
│           └── TenantUtils.java
│
├── base-system/                           # 系统管理域
│   ├── base-system-domain/                #   领域层
│   │   └── src/main/java/.../system/domain/
│   │       ├── User.java                  #   聚合根
│   │       ├── Dept.java
│   │       ├── Post.java
│   │       ├── UserRepository.java        #   仓储接口
│   │       └── UserService.java           #   领域服务
│   ├── base-system-infrastructure/        #   基础设施层
│   │   └── src/main/java/.../system/infrastructure/
│   │       ├── UserRepositoryImpl.java    #   仓储实现
│   │       ├── UserMapper.java            #   Fluent-MyBatis Mapper
│   │       ├── dataobject/
│   │       │   └── UserDO.java            #   数据库实体（继承 BaseEntity）
│   │       └── convert/
│   │           └── UserConvert.java       #   MapStruct 转换
│   ├── base-system-app/                   #   应用层
│   │   └── src/main/java/.../system/app/
│   │       ├── UserAppService.java        #   应用服务（编排）
│   │       ├── command/
│   │       │   ├── CreateUserCommand.java
│   │       │   └── UpdateUserCommand.java
│   │       └── query/
│   │           └── UserQuery.java
│   ├── base-system-adapter/               #   接口层
│   │   └── src/main/java/.../system/adapter/
│   │       ├── UserController.java
│   │       ├── DeptController.java
│   │       ├── PostController.java
│   │       └── dto/
│   │           ├── UserVO.java
│   │           └── UserCreateRequest.java
│   └── webapp/                            #   前端子应用
│       ├── src/
│       │   ├── pages/
│       │   │   ├── User/                  #   用户管理页面
│       │   │   │   ├── index.tsx
│       │   │   │   ├── components/
│       │   │   │   │   └── UserForm.tsx
│       │   │   │   └── services/
│       │   │   │       └── user.ts
│       │   │   ├── Dept/                  #   部门管理页面
│       │   │   └── Post/                  #   岗位管理页面
│       │   ├── components/                #   域内共享组件
│       │   ├── services/                  #   API 调用
│       │   ├── store/                     #   本地状态
│       │   ├── router.tsx                 #   子应用路由
│       │   ├── App.tsx
│       │   └── main.tsx                   #   导出生命周期
│       ├── package.json                   #   name: 'sub-system', port: 7101
│       ├── vite.config.ts
│       └── tsconfig.json
│
├── base-auth/                             # 认证域（同结构）
│   ├── base-auth-domain/
│   ├── base-auth-infrastructure/
│   ├── base-auth-app/
│   ├── base-auth-adapter/
│   └── webapp/                            #   前端子应用：登录页等
│
├── base-permission/                       # 权限域（同结构）
│   ├── base-permission-domain/
│   ├── base-permission-infrastructure/
│   ├── base-permission-app/
│   ├── base-permission-adapter/
│   └── webapp/                            #   前端子应用：角色、菜单管理
│
├── base-dict/                             # 字典域（同结构）
│   ├── ...
│   └── webapp/                            #   前端子应用：字典管理
│
├── base-log/                              # 日志域（同结构）
│   ├── ...
│   └── webapp/                            #   前端子应用：日志查看
│
├── base-gateway/                          # API 网关（独立应用）
├── base-monitor/                          # 系统监控
│   └── webapp/                            #   前端子应用：监控面板
├── base-codegen/                          # 代码生成器
│   └── webapp/                            #   前端子应用：代码生成界面
├── base-file/                             # 文件管理
│   └── webapp/
├── base-job/                              # 定时任务
│   └── webapp/
├── base-notification/                     # 消息通知
│   └── webapp/
├── base-form/                             # 动态表单
│   ├── base-form-domain/
│   ├── base-form-infrastructure/
│   ├── base-form-app/
│   ├── base-form-adapter/
│   └── webapp/                            #   前端子应用：表单设计器
├── base-plugin/                           # 插件框架
├── base-extension/                        # 扩展点框架
│
├── base-admin/                            # 聚合启动模块
│   ├── src/main/
│   │   ├── java/.../AdminApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-dev.yml
│   └── webapp/                            #   主应用（Shell）
│       ├── src/
│       │   ├── layouts/                   #   全局布局
│       │   │   ├── BasicLayout.tsx
│       │   │   ├── BlankLayout.tsx
│       │   │   └── components/
│       │   │       ├── Sidebar.tsx
│       │   │       ├── Header.tsx
│       │   │       └── TabsView.tsx
│       │   ├── pages/
│       │   │   ├── Login/                 #   登录页
│       │   │   └── Dashboard/             #   仪表盘
│       │   ├── router/                    #   路由配置
│       │   ├── store/                     #   全局状态
│       │   ├── qiankun/                   #   微前端注册
│       │   │   ├── index.ts
│       │   │   ├── apps.ts                #   子应用配置表
│       │   │   └── dynamicApps.ts         #   动态注册
│       │   ├── utils/
│       │   │   ├── request.ts             #   Axios 封装
│       │   │   ├── auth.ts                #   Token 管理
│       │   │   └── storage.ts
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json                   #   name: 'main-app', port: 7000
│       ├── vite.config.ts
│       └── tsconfig.json
│
├── shared/                                # 跨域共享库
│   ├── components/                        #   通用业务组件
│   │   ├── IconSelect/
│   │   ├── DictTag/
│   │   ├── RightToolbar/
│   │   └── FormRenderer/                  #   动态表单渲染器
│   ├── hooks/                             #   公共 Hooks
│   │   ├── useDict.ts
│   │   └── usePermission.ts
│   ├── utils/                             #   工具函数
│   │   ├── request.ts
│   │   └── dict.ts
│   └── theme/                             #   主题配置
│       └── index.ts
│
└── sql/
    └── init.sql                           # 初始化 SQL
```

### 7.2 webapp 前端子应用规范

每个域模块的 `webapp/` 遵循统一结构：

```yaml
# webapp/package.json
{
  "name": "sub-system",           # 子应用名称，全局唯一
  "version": "1.0.0",
  "scripts": {
    "dev": "vite --port 7101",     # 开发端口，每个子应用不同
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "antd": "^5.0.0",
    "@zephyr/shared": "workspace:*"  # 引用共享库
  }
}
```

```typescript
// webapp/src/main.tsx — 导出生命周期
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

let root: ReactDOM.Root | null = null;

function render(props: any) {
    const { container } = props;
    const dom = container
        ? container.querySelector('#root')
        : document.getElementById('#root');
    root = ReactDOM.createRoot(dom);
    root.render(<App />);
}

renderWithQiankun({
    bootstrap() { console.log('sub-system bootstrap'); },
    mount(props) { render(props); },
    unmount() { root?.unmount(); },
    update(props) { console.log('sub-system update', props); },
});

// 独立运行
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    render({});
}
```

### 7.3 端口分配

| 模块 | 端口 | 说明 |
|------|------|------|
| main-app | 7000 | 主应用 Shell |
| base-system/webapp | 7101 | 系统管理 |
| base-auth/webapp | 7102 | 认证登录 |
| base-permission/webapp | 7103 | 权限管理 |
| base-dict/webapp | 7104 | 数据字典 |
| base-log/webapp | 7105 | 日志管理 |
| base-monitor/webapp | 7106 | 系统监控 |
| base-codegen/webapp | 7107 | 代码生成 |
| base-file/webapp | 7108 | 文件管理 |
| base-job/webapp | 7109 | 定时任务 |
| base-notification/webapp | 7110 | 消息通知 |
| base-form/webapp | 7111 | 动态表单 |
| base-extension/webapp | 7112 | 扩展点管理 |

### 7.2 前端目录

```
zephyr-web/
├── package.json                    # pnpm workspace 根
├── pnpm-workspace.yaml
├── main-app/
│   ├── src/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   └── Dashboard/
│   │   ├── router/
│   │   ├── store/
│   │   ├── qiankun/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── shared/                         # 共享组件库
│   ├── components/
│   │   ├── IconSelect/
│   │   ├── DictTag/
│   │   └── RightToolbar/
│   ├── hooks/
│   │   ├── useDict.ts
│   │   └── usePermission.ts
│   ├── utils/
│   │   ├── request.ts
│   │   └── dict.ts
│   └── theme/
│       └── index.ts
├── sub-system/
├── sub-permission/
├── sub-dict/
├── sub-log/
├── sub-monitor/
├── sub-codegen/
└── shared-package/                 # npm 私有包
    └── @zephyr/shared/
```

---

## 8. 开发规范

### 8.1 后端代码规范

| 规范 | 说明 |
|------|------|
| 命名 | 类名 UpperCamelCase，方法/变量 lowerCamelCase，常量 UPPER_SNAKE_CASE |
| 包结构 | controller → service → mapper → domain → dto |
| 注释 | 类注释必须，方法注释必须，复杂逻辑行内注释 |
| 异常 | 业务异常用 BusinessException，禁止 catch 后不处理 |
| 日志 | 使用 @Slf4j，禁止 System.out.println |
| SQL | MyBatis 参数化查询，禁止字符串拼接 |
| 分页 | 统一使用 PageResult<T> 返回 |

### 8.2 前端代码规范

| 规范 | 说明 |
|------|------|
| 组件 | 函数组件 + Hooks，PascalCase 命名 |
| 文件 | 组件文件 PascalCase，工具文件 camelCase |
| 样式 | CSS Modules 或 styled-components |
| 状态 | 简单状态用 useState，复杂用 zustand |
| API | 统一在 services/ 目录，与后端接口一一对应 |
| 类型 | 所有 props 和 API 响应定义 TypeScript 类型 |

### 8.3 Git 分支策略

```
main          ← 生产环境
├── develop   ← 开发主分支
│   ├── feature/xxx   ← 功能分支
│   ├── bugfix/xxx    ← 修复分支
│   └── release/x.x   ← 发布分支
```

### 8.4 提交规范（Conventional Commits）

```
feat: 新增用户管理模块
fix: 修复登录超时问题
docs: 更新 API 文档
refactor: 重构权限校验逻辑
chore: 更新依赖版本
```

---

## 附录 D：多语言（i18n）支持

### D.1 架构概览

```
┌─────────────────────────────────────────────────────┐
│                    前端 i18n                         │
│  i18next + react-i18next + 语言包 JSON               │
├─────────────────────────────────────────────────────┤
│                    后端 i18n                         │
│  Spring MessageSource + 数据库字典 + 请求头解析        │
└─────────────────────────────────────────────────────┘
```

### D.2 后端多语言

#### 语言包数据库表

```sql
CREATE TABLE sys_i18n_message (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    lang            VARCHAR(10) NOT NULL COMMENT '语言代码（zh-CN / en-US / ja-JP）',
    msg_key         VARCHAR(200) NOT NULL COMMENT '消息键（如 user.not_found）',
    msg_value       VARCHAR(1000) NOT NULL COMMENT '消息内容',
    module          VARCHAR(50) COMMENT '所属模块（system/auth/dict等）',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_lang_key (lang, msg_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='国际化消息表';

-- 初始化示例数据
INSERT INTO sys_i18n_message (lang, msg_key, msg_value, module) VALUES
('zh-CN', 'user.not_found', '用户不存在', 'system'),
('zh-CN', 'user.username.exists', '用户名已存在', 'system'),
('zh-CN', 'auth.login.failed', '登录失败', 'auth'),
('zh-CN', 'auth.password.error', '密码错误', 'auth'),
('en-US', 'user.not_found', 'User not found', 'system'),
('en-US', 'user.username.exists', 'Username already exists', 'system'),
('en-US', 'auth.login.failed', 'Login failed', 'auth'),
('en-US', 'auth.password.error', 'Password error', 'auth');
```

#### 后端语言解析

```java
@Component
public class I18nMessageResolver {

    @Autowired
    private MessageSource messageSource;  // Spring MessageSource

    /**
     * 根据请求头 Accept-Language 解析消息
     */
    public String getMessage(String key, String lang, Object... args) {
        Locale locale = Locale.forLanguageTag(lang);
        return messageSource.getMessage(key, args, locale);
    }
}

// 统一响应中使用
R.fail("user.not_found");  // 自动根据语言返回对应消息
```

#### 语言检测优先级

```
1. 请求头 X-Language（显式指定）
2. 请求头 Accept-Language（浏览器语言）
3. Token 中存储的语言偏好
4. 默认 zh-CN
```

### D.3 前端多语言

#### i18next 配置

```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';
import jaJP from './locales/ja-JP.json';

i18n.use(initReactI18next).init({
    resources: {
        'zh-CN': { translation: zhCN },
        'en-US': { translation: enUS },
        'ja-JP': { translation: jaJP },
    },
    lng: localStorage.getItem('lang') || 'zh-CN',
    fallbackLng: 'zh-CN',
    interpolation: { escapeValue: false },
});

export default i18n;
```

#### 语言包结构

```json
// locales/zh-CN.json
{
    "common": {
        "save": "保存",
        "cancel": "取消",
        "delete": "删除",
        "confirm": "确认",
        "search": "搜索",
        "reset": "重置",
        "add": "新增",
        "edit": "编辑",
        "export": "导出",
        "import": "导入"
    },
    "user": {
        "title": "用户管理",
        "username": "用户名",
        "nickname": "昵称",
        "email": "邮箱",
        "phone": "手机号",
        "status": "状态",
        "not_found": "用户不存在"
    },
    "auth": {
        "login": "登录",
        "logout": "退出登录",
        "username_placeholder": "请输入用户名",
        "password_placeholder": "请输入密码"
    }
}
```

```json
// locales/en-US.json
{
    "common": {
        "save": "Save",
        "cancel": "Cancel",
        "delete": "Delete",
        "confirm": "Confirm",
        "search": "Search",
        "reset": "Reset",
        "add": "Add",
        "edit": "Edit",
        "export": "Export",
        "import": "Import"
    },
    "user": {
        "title": "User Management",
        "username": "Username",
        "nickname": "Nickname",
        "email": "Email",
        "phone": "Phone",
        "status": "Status",
        "not_found": "User not found"
    },
    "auth": {
        "login": "Login",
        "logout": "Logout",
        "username_placeholder": "Enter username",
        "password_placeholder": "Enter password"
    }
}
```

#### React 组件中使用

```tsx
import { useTranslation } from 'react-i18next';

function UserPage() {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t('user.title')}</h1>
            <Table columns={[
                { title: t('user.username'), dataIndex: 'username' },
                { title: t('user.email'), dataIndex: 'email' },
            ]} />
            <Button>{t('common.add')}</Button>
        </div>
    );
}
```

#### 语言切换组件

```tsx
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

const languages = [
    { value: 'zh-CN', label: '🇨🇳 中文' },
    { value: 'en-US', label: '🇺🇸 English' },
    { value: 'ja-JP', label: '🇯🇵 日本語' },
];

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    return (
        <Select
            value={i18n.language}
            onChange={(lang) => {
                i18n.changeLanguage(lang);
                localStorage.setItem('lang', lang);
            }}
            options={languages}
            style={{ width: 120 }}
        />
    );
}
```

### D.4 多语言管理 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/i18n/messages?lang={lang} | 获取指定语言的所有消息 |
| GET | /api/i18n/messages?lang={lang}&module={module} | 获取指定模块的消息 |
| POST | /api/i18n/messages | 新增/更新消息 |
| DELETE | /api/i18n/messages/{id} | 删除消息 |
| GET | /api/i18n/languages | 获取支持的语言列表 |

### D.5 前端动态语言包

```typescript
// 从后端加载语言包（支持运行时扩展）
export async function loadRemoteLang(lang: string) {
    const { data } = await request.get(`/api/i18n/messages?lang=${lang}`);
    const messages = data.reduce((acc, item) => {
        acc[item.msgKey] = item.msgValue;
        return acc;
    }, {});
    i18n.addResourceBundle(lang, 'translation', messages, true, true);
}
```

---

## 附录 E：Fluent-MyBatis 代码示例

### D.1 实体类（编译期生成）

```java
// UserDO.java — 使用注解，编译期自动生成 Entity、Mapper、FluentQuery
@Tables({
    @Table(value = "sys_user", desc = "用户表")
})
public class UserDO extends BaseEntity {

    @Column(value = "tenant_id", desc = "租户ID")
    private Long tenantId;

    @Column(value = "username", desc = "用户名", length = 50, notNull = true)
    private String username;

    @Column(value = "password", desc = "密码", length = 200, notNull = true)
    private String password;

    @Column(value = "nickname", desc = "昵称", length = 50)
    private String nickname;

    @Column(value = "email", desc = "邮箱", length = 100)
    private String email;

    @Column(value = "phone", desc = "手机号", length = 20)
    private String phone;

    @Column(value = "avatar", desc = "头像", length = 500)
    private String avatar;

    @Column(value = "gender", desc = "性别", defaultValue = "0")
    private Integer gender;

    @Column(value = "status", desc = "状态", defaultValue = "1")
    private Integer status;

    // getter/setter 省略
}
```

### D.2 Mapper 接口

```java
// UserMapper.java — 继承 EntityMapper，自动获得 CRUD 能力
public interface UserMapper extends EntityMapper<UserDO> {
    // 基础 CRUD 已自动生成，无需手写
    // 按需添加自定义方法：
    @Select("SELECT * FROM sys_user WHERE username = #{username} AND deleted = 0")
    UserDO selectByUsername(@Param("username") String username);
}
```

### D.3 类型安全查询（Fluent Query）

```java
// UserRepositoryImpl.java — 使用 Fluent Query 替代 XML
@Repository
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDO findByUsername(String username) {
        // 编译期类型安全查询
        return userMapper.selectOne(
            new FluentQueryWrapper<UserDO>()
                .eq(UserDO::getUsername, username)
                .eq(UserDO::getDeleted, 0)
        );
    }

    @Override
    public PageResult<UserDO> findPage(UserQuery query) {
        // 分页 + 条件查询
        FluentQueryWrapper<UserDO> wrapper = new FluentQueryWrapper<UserDO>()
            .like(StringUtils.isNotBlank(query.getKeyword()), UserDO::getUsername, query.getKeyword())
            .eq(query.getStatus() != null, UserDO::getStatus, query.getStatus())
            .eq(UserDO::getDeleted, 0)
            .orderByDesc(UserDO::getCreatedAt);

        Page<UserDO> page = userMapper.selectPage(
            new Page<>(query.getPage(), query.getSize()),
            wrapper
        );
        return new PageResult<>(page.getRecords(), page.getTotal());
    }

    @Override
    public int insert(UserDO user) {
        return userMapper.insert(user);
    }

    @Override
    public int updateById(UserDO user) {
        return userMapper.updateById(user);
    }

    @Override
    public int deleteById(Long id) {
        // 逻辑删除
        UserDO update = new UserDO();
        update.setId(id);
        update.setDeleted(1);
        return userMapper.updateById(update);
    }
}
```

### D.4 Fluent-MyBatis vs MyBatis-Plus 对比

| 特性 | Fluent-MyBatis | MyBatis-Plus |
|------|---------------|-------------|
| SQL 生成 | 编译期注解处理，零反射 | 运行时反射生成 |
| 类型安全 | ✅ 编译期检查字段名 | ❌ 字符串引用 |
| 性能 | 更高（无反射开销） | 有反射开销 |
| 代码生成 | 注解驱动，无需额外插件 | 需要代码生成器 |
| 分页 | 内置支持 | 内置支持 |
| 逻辑删除 | 注解配置 | 注解配置 |
| 自动填充 | 支持 | 支持 |
| 学习成本 | 较低 | 较低 |

---

*文档结束*
