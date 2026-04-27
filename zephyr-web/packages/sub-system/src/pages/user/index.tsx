import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Form, Row, Col, Modal, message, Typography, Select, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface User {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  dept: string;
  roles: string[];
  status: string;
  createTime: string;
}

const mockData: User[] = [
  { id: '1', username: 'admin', nickname: '超级管理员', email: 'admin@zephyr.com', phone: '13800000001', dept: '研发部门', roles: ['admin', 'developer'], status: '正常', createTime: '2024-01-01 00:00:00' },
  { id: '2', username: 'zhangsan', nickname: '张三', email: 'zhangsan@zephyr.com', phone: '13800000002', dept: '市场部门', roles: ['marketing'], status: '正常', createTime: '2024-01-05 10:00:00' },
  { id: '3', username: 'lisi', nickname: '李四', email: 'lisi@zephyr.com', phone: '13800000003', dept: '财务部门', roles: ['finance'], status: '正常', createTime: '2024-01-08 14:00:00' },
  { id: '4', username: 'wangwu', nickname: '王五', email: 'wangwu@zephyr.com', phone: '13800000004', dept: '研发部门', roles: ['developer'], status: '停用', createTime: '2024-01-10 09:00:00' },
  { id: '5', username: 'zhaoliu', nickname: '赵六', email: 'zhaoliu@zephyr.com', phone: '13800000005', dept: '产品部门', roles: ['product'], status: '正常', createTime: '2024-01-12 16:00:00' },
  { id: '6', username: 'sunqi', nickname: '孙七', email: 'sunqi@zephyr.com', phone: '13800000006', dept: '研发部门', roles: ['developer'], status: '正常', createTime: '2024-01-15 11:00:00' },
  { id: '7', username: 'zhouba', nickname: '周八', email: 'zhouba@zephyr.com', phone: '13800000007', dept: '运维部门', roles: ['ops'], status: '正常', createTime: '2024-01-18 08:30:00' },
  { id: '8', username: 'wujiu', nickname: '吴九', email: 'wujiu@zephyr.com', phone: '13800000008', dept: '设计部门', roles: ['designer'], status: '停用', createTime: '2024-01-20 15:00:00' },
];

const UserPage: React.FC = () => {
  const [data] = useState<User[]>(mockData);
  const [loading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<User> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 120 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
    { title: '手机', dataIndex: 'phone', key: 'phone', width: 140 },
    { title: '部门', dataIndex: 'dept', key: 'dept', width: 120 },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      width: 180,
      render: (roles: string[]) =>
        roles.map((role) => (
          <Tag key={role} color="blue">
            {role}
          </Tag>
        )),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === '正常' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
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

  const handleEdit = (record: User) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (record: User) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 "${record.nickname}" 吗？`,
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
        用户管理
      </Title>

      <Card bordered={false}>
        {/* 搜索栏 */}
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={5}>
              <Form.Item name="username" label="用户名">
                <Input placeholder="请输入用户名" allowClear />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="phone" label="手机号">
                <Input placeholder="请输入手机号" allowClear />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear>
                  <Select.Option value="正常">正常</Select.Option>
                  <Select.Option value="停用">停用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="dept" label="部门">
                <Input placeholder="请输入部门" allowClear />
              </Form.Item>
            </Col>
            <Col>
              <Space>
                <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
                <Button icon={<ReloadOutlined />}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        {/* 操作按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
            <Button danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0}>
              批量删除
            </Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑用户' : '新增用户'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        width={640}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
                <Input placeholder="请输入昵称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '请输入有效的邮箱' }]}>
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="手机号">
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dept" label="部门">
                <Input placeholder="请输入部门" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态">
                  <Select.Option value="正常">正常</Select.Option>
                  <Select.Option value="停用">停用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="roles" label="角色">
            <Select mode="multiple" placeholder="请选择角色">
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="developer">开发者</Select.Option>
              <Select.Option value="marketing">市场</Select.Option>
              <Select.Option value="finance">财务</Select.Option>
              <Select.Option value="product">产品</Select.Option>
              <Select.Option value="ops">运维</Select.Option>
              <Select.Option value="designer">设计</Select.Option>
            </Select>
          </Form.Item>
          {!editingRecord && (
            <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
