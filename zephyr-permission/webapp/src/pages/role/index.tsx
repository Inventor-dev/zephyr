import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Form, Row, Col, Modal, message, Typography, Tree, Drawer } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  status: string;
  createTime: string;
}

const mockData: Role[] = [
  { id: '1', name: '超级管理员', code: 'admin', description: '拥有所有权限', status: '正常', createTime: '2024-01-01 00:00:00' },
  { id: '2', name: '普通用户', code: 'user', description: '基础操作权限', status: '正常', createTime: '2024-01-01 00:00:00' },
  { id: '3', name: '管理员', code: 'manager', description: '部门管理权限', status: '正常', createTime: '2024-01-05 10:00:00' },
  { id: '4', name: '审计员', code: 'auditor', description: '日志查看权限', status: '正常', createTime: '2024-01-08 14:00:00' },
  { id: '5', name: '开发者', code: 'developer', description: '开发相关权限', status: '正常', createTime: '2024-01-10 09:00:00' },
  { id: '6', name: '访客', code: 'guest', description: '只读权限', status: '停用', createTime: '2024-01-12 16:00:00' },
];

const menuTreeData = [
  {
    title: '系统管理',
    key: 'system',
    children: [
      { title: '用户管理', key: 'system:user' },
      { title: '部门管理', key: 'system:dept' },
      { title: '端点管理', key: 'system:endpoint' },
    ],
  },
  {
    title: '权限管理',
    key: 'permission',
    children: [
      { title: '角色管理', key: 'permission:role' },
      { title: '菜单管理', key: 'permission:menu' },
    ],
  },
  {
    title: '数据字典',
    key: 'dict',
    children: [
      { title: '字典类型', key: 'dict:type' },
      { title: '字典数据', key: 'dict:data' },
    ],
  },
  {
    title: '日志管理',
    key: 'log',
    children: [
      { title: '操作日志', key: 'log:operation' },
      { title: '登录日志', key: 'log:login' },
    ],
  },
];

const RolePage: React.FC = () => {
  const [data] = useState<Role[]>(mockData);
  const [loading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Role | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  const columns: ColumnsType<Role> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '角色名称', dataIndex: 'name', key: 'name', width: 140 },
    { title: '角色标识', dataIndex: 'code', key: 'code', width: 120, render: (code: string) => <Tag>{code}</Tag> },
    { title: '描述', dataIndex: 'description', key: 'description', width: 250 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => <Tag color={status === '正常' ? 'green' : 'red'}>{status}</Tag>,
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => handlePerm(record)}>权限</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); setModalOpen(true); };
  const handleEdit = (record: Role) => { setEditingRecord(record); form.setFieldsValue(record); setModalOpen(true); };
  const handlePerm = (record: Role) => { setEditingRecord(record); setCheckedKeys(['system:user', 'permission:role']); setDrawerOpen(true); };
  const handleDelete = (record: Role) => {
    Modal.confirm({ title: '确认删除', content: `确定要删除角色 "${record.name}" 吗？`, onOk: () => message.success('删除成功') });
  };
  const handleModalOk = () => {
    form.validateFields().then(() => { message.success(editingRecord ? '更新成功' : '创建成功'); setModalOpen(false); });
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>角色管理</Title>
      <Card bordered={false}>
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={6}><Form.Item name="name" label="角色名称"><Input placeholder="请输入角色名称" allowClear /></Form.Item></Col>
            <Col span={6}><Form.Item name="code" label="角色标识"><Input placeholder="请输入角色标识" allowClear /></Form.Item></Col>
            <Col><Space><Button type="primary" icon={<SearchOutlined />}>搜索</Button><Button icon={<ReloadOutlined />}>重置</Button></Space></Col>
          </Row>
        </Form>
        <div style={{ marginBottom: 16 }}><Space><Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button></Space></div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 1200 }} />
      </Card>

      <Modal title={editingRecord ? '编辑角色' : '新增角色'} open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}><Input placeholder="请输入角色名称" /></Form.Item>
          <Form.Item name="code" label="角色标识" rules={[{ required: true, message: '请输入角色标识' }]}><Input placeholder="请输入角色标识" /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={3} placeholder="请输入描述" /></Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态">
              <Select.Option value="正常">正常</Select.Option>
              <Select.Option value="停用">停用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer title={`权限分配 - ${editingRecord?.name}`} placement="right" width={400} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Tree checkable defaultExpandAll treeData={menuTreeData} checkedKeys={checkedKeys} onCheck={(keys) => setCheckedKeys(keys as React.Key[])} />
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Space><Button onClick={() => setDrawerOpen(false)}>取消</Button><Button type="primary" onClick={() => { message.success('保存成功'); setDrawerOpen(false); }}>保存</Button></Space>
        </div>
      </Drawer>
    </div>
  );
};

export default RolePage;
