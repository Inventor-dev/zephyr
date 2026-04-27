# Zephyr 项目开发规则

> 基于 design/v1.0/ 设计文档 + 实际开发经验沉淀

---

## 1. 项目基本信息

| 项 | 值 |
|---|---|
| 项目名 | Zephyr（和風·微風） |
| 包基础路径 | `xyz.lemone.zephyr` |
| groupId | `xyz.lemone.zephyr` |
| GitHub | https://github.com/Inventor-dev/zephyr |
| 主分支 | `feature/init-project` |

---

## 2. 技术栈

### 后端
| 技术 | 版本 | 说明 |
|------|------|------|
| JDK | 25 | OpenJDK |
| Spring Boot | 4.0.0 | |
| Spring Cloud | 2024.0.1 | Gateway |
| ORM | Fluent-MyBatis 1.9.10 | 编译期 SQL，零反射 |
| 数据库 | MySQL 9.1.0 | |
| 缓存 | Redisson 3.37.0 | |
| 认证 | Sa-Token 1.39.0 | |
| API 文档 | SpringDoc 2.8.3 | |
| 工具 | Hutool 5.8.32 | |
| 映射 | MapStruct 1.6.3 | |
| Lombok | 1.18.38 | |

### 前端
| 技术 | 版本 |
|------|------|
| React | 18.x |
| Ant Design | 5.x |
| 微前端 | Qiankun 2.x |
| 构建 | Vite 5.x |
| 包管理 | pnpm 9.x |
| 语言 | TypeScript 5.x |

---

## 3. 目录结构规则

### 后端模块
```
zephyr/
├── pom.xml                          # 根 POM（版本管理）
├── zephyr-common/                   # 公共模块
│   ├── zephyr-common-core/          #   核心工具（R、异常、枚举）
│   ├── zephyr-common-redis/         #   Redis 封装
│   └── zephyr-common-security/      #   Sa-Token 认证
├── zephyr-auth/                     # 认证模块
├── zephyr-system/                   # 系统管理
├── zephyr-permission/               # 权限管理
├── zephyr-dict/                     # 数据字典
├── zephyr-log/                      # 日志审计
├── zephyr-monitor/                  # 系统监控
├── zephyr-codegen/                  # 代码生成器
├── zephyr-file/                     # 文件管理
├── zephyr-job/                      # 定时任务
├── zephyr-notification/             # 消息通知
├── zephyr-form/                     # 动态表单
├── zephyr-extension/                # 扩展点管理
├── zephyr-plugin/                   # 插件框架
├── zephyr-gateway/                  # API 网关
└── zephyr-admin/                    # 聚合启动模块
```

### 前端代码位置
每个模块的前端代码放在对应后端模块的 `webapp/` 目录下：
```
zephyr-admin/webapp/              ← 主应用 Shell
zephyr-common/webapp-shared/      ← 共享组件库
zephyr-system/webapp/             ← 系统管理前端
zephyr-permission/webapp/         ← 权限管理前端
zephyr-dict/webapp/               ← 字典管理前端
...以此类推
```

### 端口分配
| 模块 | 端口 |
|------|------|
| zephyr-gateway | 7000 |
| zephyr-admin | 7000 |
| zephyr-system | 7101 |
| zephyr-auth | 7102 |
| zephyr-permission | 7103 |
| zephyr-dict | 7104 |
| zephyr-log | 7105 |
| zephyr-monitor | 7106 |
| zephyr-codegen | 7107 |
| zephyr-file | 7108 |
| zephyr-job | 7109 |
| zephyr-notification | 7110 |
| zephyr-form | 7111 |
| zephyr-extension | 7112 |

---

## 4. 命名规范

### Java 类命名
| 类型 | 规范 | 示例 |
|------|------|------|
| Controller | `{Entity}Controller` | `UserController` |
| 请求 DTO | `{Action}{Entity}Command` | `CreateUserCommand` |
| 响应 DTO | `{Entity}VO` | `UserVO` |
| App Service | `{Entity}AppService` | `UserAppService` |
| Domain Service | `{Entity}Service` | `UserService` |
| 聚合根 | `{Entity}` | `User` |
| 领域对象 | `{Entity}DO` | `UserProfile` |
| 仓储接口 | `{Entity}Repository` | `UserRepository` |
| 仓储实现 | `{Entity}RepositoryImpl` | `UserRepositoryImpl` |
| Mapper | `{Entity}Mapper` | `UserMapper` |

### 包结构
```
xyz.lemone.zephyr.{module}
├── controller/        # Controller（adapter 层）
├── domain/            # 领域模型
├── mapper/            # MyBatis Mapper
├── service/           # Service 接口
│   └── impl/          # Service 实现
└── config/            # 配置类
```

### API 路径
```
/api/{module}/{entity}/{action}
```
示例：
- `GET /api/system/user/list`
- `POST /api/system/user`
- `PUT /api/system/user/{id}`
- `DELETE /api/system/user/{id}`

### 数据库表名
```
sys_{entity}
```
示例：`sys_user`, `sys_role`, `sys_menu`, `sys_dict_type`

### Git Commit
```
{type}({scope}): {description}
```
类型：`feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`
示例：
- `feat(auth): 添加登录接口`
- `refactor: 迁移 groupId com.zephyr → xyz.lemone.zephyr`
- `feat: 初始化前端微前端项目 (zephyr-web)`

---

## 5. 统一响应体

后端所有接口返回统一格式：
```json
{
  "success": true,
  "data": {},
  "errorCode": null,
  "errorMessage": null,
  "timestamp": 1714000000000
}
```

对应 Java 类：`xyz.lemone.zephyr.common.core.domain.R<T>`

---

## 6. 架构规则（COLA 分层）

```
adapter（接口层）→ app（应用层）→ domain（领域层）
                                  ↑
app → infrastructure（基础设施层）→ domain
```

**依赖规则：**
- ✅ adapter 可依赖 app 和 infrastructure
- ✅ app 可依赖 domain 和 infrastructure
- ✅ domain 不依赖任何其他层（纯领域逻辑）
- ✅ infrastructure 实现 domain 中定义的仓储接口

---

## 7. 前端规则

### 微前端架构
- 主应用 Shell 端口：7000
- 每个子应用独立端口（7101-7112）
- 子应用通过 Qiankun 注册到主应用
- 每个子应用必须导出 `bootstrap`、`mount`、`unmount` 生命周期

### 前端页面规范
- 使用 Ant Design 5 组件
- 表格页面统一：搜索栏 + 操作按钮 + 数据表格 + 分页
- 弹窗表单：Modal + Form
- 样式：CSS Modules 或内联样式（不引入额外 CSS 文件）

### Vite 配置
- 主应用：`port: 7000`
- 子应用：各自独立端口
- 微前端模式下设置 `base` 为子应用入口

---

## 8. 构建规则

### Maven
- 根 POM 统一管理版本号
- 每个模块的 `pom.xml` 包含 `frontend-maven-plugin`
- `mvn clean package` 自动构建前端 + 后端

### 前端
- 根目录 `pnpm-workspace.yaml` 管理所有前端包
- `pnpm install` 安装依赖
- `pnpm dev` 启动所有子应用

---

## 9. 禁止事项

- ❌ 不使用 MyBatis-Plus（用 Fluent-MyBatis）
- ❌ 不使用 Spring Security（用 Sa-Token）
- ❌ 不在 domain 层依赖 infrastructure
- ❌ 不硬编码配置值（用 application.yml）
- ❌ 不在前端使用 class 组件（用函数组件 + Hooks）
- ❌ 不使用 `console.log` 调试生产代码
- ❌ 不提交 `node_modules/`、`target/`、`.env.local`

---

## 10. 待办事项

- [ ] 安装 JDK 25 + Maven 编译验证
- [ ] 各子应用 vite.config.ts 适配新路径
- [ ] 前端 @zephyr/shared 依赖路径更新
- [ ] 数据库初始化脚本执行
- [ ] Spring Boot 启动类创建
- [ ] API 接口联调
