import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Form, Row, Col, Modal, message, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface DictType {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string;
  createTime: string;
}

const mockData: DictType[] = [
  { id: '1', name: '用户性别', type: 'sys_user_gender', status: '正常', description: '用户性别列表', createTime: '2024-01-01 00:00:00' },
  { id: '2', name: '系统状态', type: 'sys_common_status', status: '正常', description: '系统通用状态', createTime: '2024-01-01 00:00:00' },
  { id: '3', name: '操作类型', type: 'sys_oper_type', status: '正常', description: '系统操作类型', createTime: '2024-01-05 10:00:00' },
  { id: '4', name: '通知类型', type: 'sys_notice_type', status: '正常', description: '通知类型列表', createTime: '2024-01-08 14:00:00' },
  { id: '5', name: '菜单类型', type: 'sys_menu_type', status: '正常', description: '菜单类型列表', createTime: '2024-01-10 09:00:00' },
  { id: '6', name: '数据范围', type: 'sys_data_scope', status: '停用', description: '数据范围列表', createTime: '2024-01-12 16:00:00' },
];

const DictTypePage: React.FC = () => {
  const [data] = useState<DictType[]>(mockData);
  const [loading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DictType | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<DictType> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '字典名称', dataIndex: 'name', key: 'name', width: 140 },
    { title: '字典类型', dataIndex: 'type', key: 'type', width: 180, render: (type: string) => <Tag>{type}</Tag> },
    { title: '描述', dataIndex: 'description', key: 'description', width: 200 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status: string) => <Tag color={status === '正常' ? 'green' : 'red'}>{status}</Tag> },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作', key: 'action', width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); setModalOpen(true); };
  const handleEdit = (record: DictType) => { setEditingRecord(record); form.setFieldsValue(record); setModalOpen(true); };
  const handleDelete = (record: DictType) => {
    Modal.confirm({ title: '确认删除', content: `确定要删除字典类型 "${record.name}" 吗？`, onOk: () => message.success('删除成功') });
  };
  const handleModalOk = () => {
    form.validateFields().then(() => { message.success(editingRecord ? '更新成功' : '创建成功'); setModalOpen(false); });
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>字典类型</Title>
      <Card bordered={false}>
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={6}><Form.Item name="name" label="字典名称"><Input placeholder="请输入字典名称" allowClear /></Form.Item></Col>
            <Col span={6}><Form.Item name="type" label="字典类型"><Input placeholder="请输入字典类型" allowClear /></Form.Item></Col>
            <Col><Space><Button type="primary" icon={<SearchOutlined />}>搜索</Button><Button icon={<ReloadOutlined />}>重置</Button></Space></Col>
          </Row>
        </Form>
        <div style={{ marginBottom: 16 }}><Space><Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button></Space></div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title={editingRecord ? '编辑字典类型' : '新增字典类型'} open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="字典名称" rules={[{ required: true }]}><Input placeholder="请输入字典名称" /></Form.Item>
          <Form.Item name="type" label="字典类型" rules={[{ required: true }]}><Input placeholder="请输入字典类型" /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={3} placeholder="请输入描述" /></Form.Item>
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



export default DictTypePage;
