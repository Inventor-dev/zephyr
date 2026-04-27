import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, message, Typography, Form, Input, Select, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface MenuItem {
  id: string;
  name: string;
  parentId: string;
  type: string;
  path: string;
  component: string;
  icon: string;
  orderNum: number;
  status: string;
  children?: MenuItem[];
}

const mockData: MenuItem[] = [
  {
    id: '1',
    name: '仪表盘',
    parentId: '0',
    type: '目录',
    path: '/dashboard',
    component: 'dashboard/index',
    icon: 'DashboardOutlined',
    orderNum: 1,
    status: '正常',
  },
  {
    id: '2',
    name: '系统管理',
    parentId: '0',
    type: '目录',
    path: '/system',
    component: '',
    icon: 'SettingOutlined',
    orderNum: 2,
    status: '正常',
    children: [
      { id: '21', name: '用户管理', parentId: '2', type: '菜单', path: '/system/user', component: 'system/user/index', icon: 'UserOutlined', orderNum: 1, status: '正常' },
      { id: '22', name: '部门管理', parentId: '2', type: '菜单', path: '/system/dept', component: 'system/dept/index', icon: 'ApartmentOutlined', orderNum: 2, status: '正常' },
      { id: '23', name: '端点管理', parentId: '2', type: '菜单', path: '/system/endpoint', component: 'system/endpoint/index', icon: 'ApiOutlined', orderNum: 3, status: '正常' },
    ],
  },
  {
    id: '3',
    name: '权限管理',
    parentId: '0',
    type: '目录',
    path: '/permission',
    component: '',
    icon: 'SafetyCertificateOutlined',
    orderNum: 3,
    status: '正常',
    children: [
      { id: '31', name: '角色管理', parentId: '3', type: '菜单', path: '/permission/role', component: 'permission/role/index', icon: 'SafetyCertificateOutlined', orderNum: 1, status: '正常' },
      { id: '32', name: '菜单管理', parentId: '3', type: '菜单', path: '/permission/menu', component: 'permission/menu/index', icon: 'UnorderedListOutlined', orderNum: 2, status: '正常' },
    ],
  },
  {
    id: '4',
    name: '数据字典',
    parentId: '0',
    type: '目录',
    path: '/dict',
    component: '',
    icon: 'BookOutlined',
    orderNum: 4,
    status: '正常',
    children: [
      { id: '41', name: '字典类型', parentId: '4', type: '菜单', path: '/dict/type', component: 'dict/type/index', icon: 'BookOutlined', orderNum: 1, status: '正常' },
      { id: '42', name: '字典数据', parentId: '4', type: '菜单', path: '/dict/data', component: 'dict/data/index', icon: 'DatabaseOutlined', orderNum: 2, status: '正常' },
    ],
  },
  {
    id: '5',
    name: '日志管理',
    parentId: '0',
    type: '目录',
    path: '/log',
    component: '',
    icon: 'FileTextOutlined',
    orderNum: 5,
    status: '正常',
    children: [
      { id: '51', name: '操作日志', parentId: '5', type: '菜单', path: '/log/operation', component: 'log/operation/index', icon: 'FileTextOutlined', orderNum: 1, status: '正常' },
      { id: '52', name: '登录日志', parentId: '5', type: '菜单', path: '/log/login', component: 'log/login/index', icon: 'FileTextOutlined', orderNum: 2, status: '正常' },
    ],
  },
];

const MenuPage: React.FC = () => {
  const [data] = useState<MenuItem[]>(mockData);
  const [loading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<MenuItem> = [
    { title: '菜单名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 80, render: (type: string) => <Tag color={type === '目录' ? 'blue' : type === '菜单' ? 'green' : 'orange'}>{type}</Tag> },
    { title: '路由路径', dataIndex: 'path', key: 'path', width: 180 },
    { title: '组件路径', dataIndex: 'component', key: 'component', width: 200 },
    { title: '图标', dataIndex: 'icon', key: 'icon', width: 120 },
    { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 60 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status: string) => <Tag color={status === '正常' ? 'green' : 'red'}>{status}</Tag> },
    {
      title: '操作', key: 'action', width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<PlusOutlined />}>新增</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); setModalOpen(true); };
  const handleEdit = (record: MenuItem) => { setEditingRecord(record); form.setFieldsValue(record); setModalOpen(true); };
  const handleDelete = (record: MenuItem) => {
    Modal.confirm({ title: '确认删除', content: `确定要删除菜单 "${record.name}" 吗？`, onOk: () => message.success('删除成功') });
  };
  const handleModalOk = () => {
    form.validateFields().then(() => { message.success(editingRecord ? '更新成功' : '创建成功'); setModalOpen(false); });
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>菜单管理</Title>
      <Card bordered={false}>
        <div style={{ marginBottom: 16 }}><Space><Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button></Space></div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={false} defaultExpandAllRows childrenColumnName="children" />
      </Card>

      <Modal title={editingRecord ? '编辑菜单' : '新增菜单'} open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)} width={640}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="菜单名称" rules={[{ required: true, message: '请输入菜单名称' }]}><Input placeholder="请输入菜单名称" /></Form.Item>
          <Form.Item name="parentId" label="上级菜单">
            <Select placeholder="请选择上级菜单">
              <Select.Option value="0">顶级菜单</Select.Option>
              <Select.Option value="1">仪表盘</Select.Option>
              <Select.Option value="2">系统管理</Select.Option>
              <Select.Option value="3">权限管理</Select.Option>
              <Select.Option value="4">数据字典</Select.Option>
              <Select.Option value="5">日志管理</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="菜单类型" rules={[{ required: true, message: '请选择菜单类型' }]}>
            <Select placeholder="请选择类型">
              <Select.Option value="目录">目录</Select.Option>
              <Select.Option value="菜单">菜单</Select.Option>
              <Select.Option value="按钮">按钮</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="path" label="路由路径"><Input placeholder="请输入路由路径" /></Form.Item>
          <Form.Item name="component" label="组件路径"><Input placeholder="请输入组件路径" /></Form.Item>
          <Form.Item name="icon" label="图标"><Input placeholder="请输入图标名称" /></Form.Item>
          <Form.Item name="orderNum" label="排序"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态">
              <Select.Option value="正常">正常</Select.Option>
              <Select.Option value="停用">停用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuPage;
