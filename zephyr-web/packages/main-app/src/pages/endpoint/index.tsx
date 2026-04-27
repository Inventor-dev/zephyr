import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Form, Row, Col, Modal, message, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface Endpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  description: string;
  status: string;
  createTime: string;
}

const mockData: Endpoint[] = [
  { id: '1', name: '用户列表', url: '/api/users', method: 'GET', description: '获取用户列表', status: '启用', createTime: '2024-01-10 10:00:00' },
  { id: '2', name: '创建用户', url: '/api/users', method: 'POST', description: '创建新用户', status: '启用', createTime: '2024-01-10 10:00:00' },
  { id: '3', name: '更新用户', url: '/api/users/:id', method: 'PUT', description: '更新用户信息', status: '启用', createTime: '2024-01-10 10:00:00' },
  { id: '4', name: '删除用户', url: '/api/users/:id', method: 'DELETE', description: '删除用户', status: '禁用', createTime: '2024-01-10 10:00:00' },
  { id: '5', name: '角色列表', url: '/api/roles', method: 'GET', description: '获取角色列表', status: '启用', createTime: '2024-01-10 10:00:00' },
  { id: '6', name: '字典查询', url: '/api/dict/:type', method: 'GET', description: '根据类型查询字典', status: '启用', createTime: '2024-01-10 10:00:00' },
];

const methodColors: Record<string, string> = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  DELETE: 'red',
  PATCH: 'purple',
};

const EndpointPage: React.FC = () => {
  const [data] = useState<Endpoint[]>(mockData);
  const [loading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Endpoint | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<Endpoint> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 140 },
    { title: 'URL', dataIndex: 'url', key: 'url', width: 200 },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method: string) => <Tag color={methodColors[method]}>{method}</Tag>,
    },
    { title: '描述', dataIndex: 'description', key: 'description', width: 200 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === '启用' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: Endpoint) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (record: Endpoint) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除端点 "${record.name}" 吗？`,
      onOk: () => message.success('删除成功'),
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success(editingRecord ? '更新成功' : '创建成功');
      setModalOpen(false);
    });
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        端点管理
      </Title>

      <Card bordered={false}>
        {/* 搜索栏 */}
        <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={6}>
              <Form.Item name="name" label="名称">
                <Input placeholder="请输入名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="url" label="URL">
                <Input placeholder="请输入URL" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="method" label="方法">
                <Input placeholder="请输入方法" allowClear />
              </Form.Item>
            </Col>
            <Col>
              <Space>
                <Button type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button icon={<ReloadOutlined />}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        {/* 操作按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
          </Space>
        </div>

        {/* 数据表格 */}
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑端点' : '新增端点'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="url" label="URL" rules={[{ required: true, message: '请输入URL' }]}>
            <Input placeholder="请输入URL" />
          </Form.Item>
          <Form.Item name="method" label="方法" rules={[{ required: true, message: '请选择方法' }]}>
            <Input placeholder="请输入方法" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EndpointPage;
