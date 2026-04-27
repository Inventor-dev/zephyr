import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, message, Typography, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface Dept {
  id: string;
  name: string;
  parentId: string;
  orderNum: number;
  leader: string;
  phone: string;
  email: string;
  status: string;
  createTime: string;
  children?: Dept[];
}

const mockData: Dept[] = [
  {
    id: '1',
    name: 'Zephyr科技',
    parentId: '0',
    orderNum: 0,
    leader: 'Admin',
    phone: '13800000001',
    email: 'admin@zephyr.com',
    status: '正常',
    createTime: '2024-01-01 00:00:00',
    children: [
      {
        id: '10',
        name: '研发部门',
        parentId: '1',
        orderNum: 1,
        leader: '张三',
        phone: '13800000010',
        email: 'dev@zephyr.com',
        status: '正常',
        createTime: '2024-01-01 00:00:00',
        children: [
          { id: '101', name: '前端组', parentId: '10', orderNum: 1, leader: '王五', phone: '13800000101', email: 'fe@zephyr.com', status: '正常', createTime: '2024-01-01 00:00:00' },
          { id: '102', name: '后端组', parentId: '10', orderNum: 2, leader: '赵六', phone: '13800000102', email: 'be@zephyr.com', status: '正常', createTime: '2024-01-01 00:00:00' },
        ],
      },
      {
        id: '11',
        name: '市场部门',
        parentId: '1',
        orderNum: 2,
        leader: '李四',
        phone: '13800000011',
        email: 'market@zephyr.com',
        status: '正常',
        createTime: '2024-01-01 00:00:00',
      },
      {
        id: '12',
        name: '财务部门',
        parentId: '1',
        orderNum: 3,
        leader: '孙七',
        phone: '13800000012',
        email: 'finance@zephyr.com',
        status: '正常',
        createTime: '2024-01-01 00:00:00',
      },
      {
        id: '13',
        name: '运维部门',
        parentId: '1',
        orderNum: 4,
        leader: '周八',
        phone: '13800000013',
        email: 'ops@zephyr.com',
        status: '正常',
        createTime: '2024-01-01 00:00:00',
      },
    ],
  },
];

const DeptPage: React.FC = () => {
  const [data] = useState<Dept[]>(mockData);
  const [loading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Dept | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<Dept> = [
    { title: '部门名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 80 },
    { title: '负责人', dataIndex: 'leader', key: 'leader', width: 120 },
    { title: '电话', dataIndex: 'phone', key: 'phone', width: 140 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
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
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<PlusOutlined />}>
            新增
          </Button>
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

  const handleEdit = (record: Dept) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (record: Dept) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除部门 "${record.name}" 吗？`,
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
        部门管理
      </Title>

      <Card bordered={false}>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={false}
          defaultExpandAllRows
          childrenColumnName="children"
        />
      </Card>

      <Modal
        title={editingRecord ? '编辑部门' : '新增部门'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="部门名称" rules={[{ required: true, message: '请输入部门名称' }]}>
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item name="parentId" label="上级部门">
            <Select placeholder="请选择上级部门">
              <Select.Option value="1">Zephyr科技</Select.Option>
              <Select.Option value="10">研发部门</Select.Option>
              <Select.Option value="11">市场部门</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="orderNum" label="排序">
            <Input type="number" placeholder="请输入排序" />
          </Form.Item>
          <Form.Item name="leader" label="负责人">
            <Input placeholder="请输入负责人" />
          </Form.Item>
          <Form.Item name="phone" label="电话">
            <Input placeholder="请输入电话" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
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

export default DeptPage;
