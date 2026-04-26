# Git 分支规范

## 分支模型

采用 Git Flow 简化版：

```
master          ← 生产环境，只接受 develop 和 hotfix 合并
  └── develop   ← 开发主线，所有功能分支从这里分出
        ├── feature/xxx    ← 功能分支
        ├── bugfix/xxx     ← 修复分支
        └── hotfix/xxx     ← 紧急修复
```

## 分支命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 功能 | `feature/<简述>` | `feature/init-project` |
| 修复 | `bugfix/<简述>` | `bugfix/login-error` |
| 紧急 | `hotfix/<简述>` | `hotfix/security-patch` |
| 发版 | `release/<版本>` | `release/v1.0.0` |

## Commit 规范

采用 Conventional Commits：

```
<type>(<scope>): <subject>

type:
  feat     ← 新功能
  fix      ← 修复
  docs     ← 文档
  style    ← 格式（不影响代码运行）
  refactor ← 重构
  test     ← 测试
  chore    ← 构建/工具
  perf     ← 性能

scope: 模块名（可选）
subject: 简要描述

示例：
feat(system): 添加用户管理 CRUD 接口
docs: 更新设计文档 v1.0
chore: 初始化 Maven 多模块结构
```

## 工作流程

```bash
# 1. 从 develop 分支创建功能分支
git checkout develop
git checkout -b feature/xxx

# 2. 开发完成后合并到 develop
git checkout develop
git merge --no-ff feature/xxx

# 3. 删除功能分支
git branch -d feature/xxx

# 4. 发版时合并到 master
git checkout master
git merge --no-ff release/v1.0.0
git tag -a v1.0.0
```
