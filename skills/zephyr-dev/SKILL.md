---
name: zephyr-dev
description: Zephyr 多模块基础系统开发技能。当需要创建/修改 Zephyr 项目的后端模块、前端页面、数据库表、API 接口时使用此技能。包含 COLA 架构规则、命名规范、模块模板。
---

# Zephyr 开发技能

## 项目概览

Zephyr（和風·微風）是企业级多模块基础系统，采用 COLA 架构 + Qiankun 微前端。

- **包路径**：`xyz.lemone.zephyr`
- **GitHub**：https://github.com/Inventor-dev/zephyr
- **规则文档**：`docs/project-rules.md`

## 快速参考

### 新建后端模块

1. 在根目录创建模块目录：`zephyr-{module}/`
2. 创建 `pom.xml`（参考已有模块模板）
3. 在根 `pom.xml` 的 `<modules>` 中添加新模块
4. 在根 `pom.xml` 的 `<dependencyManagement>` 中添加依赖管理
5. 创建包目录：`src/main/java/xyz/lemone/zephyr/{module}/`

### 模块 POM 模板

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>xyz.lemone.zephyr</groupId>
        <artifactId>zephyr</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>zephyr-{module}</artifactId>
    <description>{描述}</description>

    <dependencies>
        <dependency>
            <groupId>xyz.lemone.zephyr</groupId>
            <artifactId>zephyr-common-security</artifactId>
        </dependency>
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
            <plugin>
                <groupId>com.github.eirslett</groupId>
                <artifactId>frontend-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <id>install-node-and-pnpm</id>
                        <goals><goal>install-node-and-pnpm</goal></goals>
                    </execution>
                    <execution>
                        <id>pnpm-install</id>
                        <goals><goal>pnpm</goal></goals>
                        <configuration><arguments>install</arguments></configuration>
                    </execution>
                    <execution>
                        <id>pnpm-build</id>
                        <goals><goal>pnpm</goal></goals>
                        <configuration><arguments>run build</arguments></configuration>
                    </execution>
                </executions>
                <configuration>
                    <workingDirectory>webapp</workingDirectory>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 新建 Java 类模板

#### Controller
```java
package xyz.lemone.zephyr.{module}.controller;

import org.springframework.web.bind.annotation.*;
import xyz.lemone.zephyr.common.core.domain.R;

@RestController
@RequestMapping("/api/{module}/{entity}")
public class {Entity}Controller {

    @GetMapping("/list")
    public R<?> list() {
        // TODO
        return R.ok();
    }

    @PostMapping
    public R<?> create(@RequestBody {Entity}VO vo) {
        // TODO
        return R.ok();
    }

    @PutMapping("/{id}")
    public R<?> update(@PathVariable Long id, @RequestBody {Entity}VO vo) {
        // TODO
        return R.ok();
    }

    @DeleteMapping("/{id}")
    public R<?> delete(@PathVariable Long id) {
        // TODO
        return R.ok();
    }
}
```

#### Service 接口
```java
package xyz.lemone.zephyr.{module}.service;

import java.util.List;

public interface {Entity}Service {
    List<{Entity}> list();
    {Entity} getById(Long id);
    void create({Entity} entity);
    void update({Entity} entity);
    void delete(Long id);
}
```

#### Service 实现
```java
package xyz.lemone.zephyr.{module}.service.impl;

import org.springframework.stereotype.Service;
import xyz.lemone.zephyr.{module}.domain.{Entity};
import xyz.lemone.zephyr.{module}.mapper.{Entity}Mapper;
import xyz.lemone.zephyr.{module}.service.{Entity}Service;

@Service
public class {Entity}ServiceImpl implements {Entity}Service {

    private final {Entity}Mapper {entity}Mapper;

    public {Entity}ServiceImpl({Entity}Mapper {entity}Mapper) {
        this.{entity}Mapper = {entity}Mapper;
    }

    // TODO implements
}
```

#### Mapper
```java
package xyz.lemone.zephyr.{module}.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface {Entity}Mapper {
    // Fluent-MyBatis 编译期生成
}
```

### 新建前端页面模板

#### 子应用入口
```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: ReactDOM.Root;

export async function bootstrap() {
  console.log('{module} bootstrapped');
}

export async function mount(props: any) {
  const { container } = props;
  root = ReactDOM.createRoot(
    container
      ? container.querySelector('#root')
      : document.getElementById('{module}-root')
  );
  root.render(<App />);
}

export async function unmount() {
  root?.unmount();
}
```

#### 页面组件
```tsx
// src/pages/{entity}/index.tsx
import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const {Entity}Page: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    // TODO: 添加列
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Button size="small" danger onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          新增
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />

      <Modal
        title="新增{实体}"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit}>
          {/* TODO: 表单项 */}
        </Form>
      </Modal>
    </div>
  );
};

export default {Entity}Page;
```

## 数据库表模板

```sql
CREATE TABLE sys_{entity} (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    -- 业务字段...
    status          TINYINT DEFAULT 1 COMMENT '1启用 0禁用',
    sort_order      INT DEFAULT 0,
    created_by      BIGINT COMMENT '创建人',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted         TINYINT DEFAULT 0,
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='{表注释}';
```

## 检查清单

开发新模块时确认：
- [ ] pom.xml 已添加到根 POM 的 modules
- [ ] groupId 使用 `xyz.lemone.zephyr`
- [ ] 包路径使用 `xyz.lemone.zephyr.{module}`
- [ ] Controller 路径遵循 `/api/{module}/{entity}` 规范
- [ ] 返回值使用 `R<T>` 统一响应体
- [ ] 表名使用 `sys_` 前缀
- [ ] 前端代码放在 `webapp/` 目录
- [ ] 前端子应用导出 qiankun 生命周期函数
- [ ] Git commit 遵循 `{type}({scope}): {description}` 格式
