import React, { useState } from 'react';
import { Card, Tabs, Typography, Button, Space, message } from 'antd';
import { DownloadOutlined, CopyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const mockCode: Record<string, string> = {
  'Entity.java': `package com.zephyr.system.domain;

import com.zephyr.common.core.domain.BaseEntity;

public class SysUser extends BaseEntity {
    private Long id;
    private String username;
    private String nickname;
    private String email;
    private String phone;
    private String status;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    // ... more getters and setters
}`,
  'Mapper.java': `package com.zephyr.system.mapper;

import com.zephyr.system.domain.SysUser;
import java.util.List;

public interface SysUserMapper {
    SysUser selectUserById(Long id);
    List<SysUser> selectUserList(SysUser user);
    int insertUser(SysUser user);
    int updateUser(SysUser user);
    int deleteUserByIds(Long[] ids);
}`,
  'Service.java': `package com.zephyr.system.service;

import com.zephyr.system.domain.SysUser;
import java.util.List;

public interface ISysUserService {
    SysUser selectUserById(Long id);
    List<SysUser> selectUserList(SysUser user);
    int insertUser(SysUser user);
    int updateUser(SysUser user);
    int deleteUserByIds(Long[] ids);
}`,
  'ServiceImpl.java': `package com.zephyr.system.service.impl;

import com.zephyr.system.domain.SysUser;
import com.zephyr.system.mapper.SysUserMapper;
import com.zephyr.system.service.ISysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SysUserServiceImpl implements ISysUserService {
    @Autowired
    private SysUserMapper userMapper;
    
    @Override
    public SysUser selectUserById(Long id) {
        return userMapper.selectUserById(id);
    }
    // ... more implementations
}`,
  'Controller.java': `package com.zephyr.system.controller;

import com.zephyr.common.core.controller.BaseController;
import com.zephyr.common.core.domain.AjaxResult;
import com.zephyr.system.domain.SysUser;
import com.zephyr.system.service.ISysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/system/user")
public class SysUserController extends BaseController {
    @Autowired
    private ISysUserService userService;
    
    @GetMapping("/{id}")
    public AjaxResult getInfo(@PathVariable Long id) {
        return success(userService.selectUserById(id));
    }
    
    @GetMapping("/list")
    public TableDataInfo list(SysUser user) {
        startPage();
        List<SysUser> list = userService.selectUserList(user);
        return getDataTable(list);
    }
}`,
};

const GenPreviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Entity.java');

  const tabItems = Object.entries(mockCode).map(([key, value]) => ({
    key,
    label: key,
    children: (
      <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, fontSize: 13, overflow: 'auto', maxHeight: 500, margin: 0 }}>
        {value}
      </pre>
    ),
  }));

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>代码预览</Title>
      <Card bordered={false}>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => message.success('下载成功')}>下载代码</Button>
            <Button icon={<CopyOutlined />} onClick={() => { navigator.clipboard.writeText(mockCode[activeTab]); message.success('复制成功'); }}>复制代码</Button>
          </Space>
        </div>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>
    </div>
  );
};

export default GenPreviewPage;
