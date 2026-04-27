import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Form, Row, Col, Modal, message, Typography, Select } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface DictData {
  id: string;
  dictType: string;
  label: string;
  value: string;
  cssClass: string;
  orderNum: number;
  status: string;
  createTime: string;
}

const mockData: DictData[] = [
  { id: '1', dictType: 'sys_user_gender', label: '男', value: '1', cssClass: '', orderNum: 1, status: '正常', createTime: '2024-01-01 00:00:00' },
  { id: '2', dictType: 'sys_user_gender', label: '女', value: '2', cssClass: '', orderNum: 2, status: '正常', createTime: '2024-01-01 00:00:00' },
  { id: '3', dictType: 'sys_user_gender', label: '未知', value: '0', cssClass: '', orderNum: 3, status: '正常', createTime: '2024-01-01 00:00:00' },
  { id: '4', dictType: 'sys_common_status', label: '正常', value: '0', cssClass: 'green', orderNum: 1, status: '正常', createTime: '2024-01-01 00:00:00' },
  { id: '5', dictType: 'sys_common_status', label: '停用', value: '1', cssClass: 'red', orderNum: 2, status: '正常', createTime: '2024-01-01 00:00:00' },
  { id: '6', dictType: 'sys_oper_type', label: '新增', value: '1', cssClass: 'green', orderNum: 1, status: '正常', createTime: '2024-01-05 10:00:00' },
  { id: '7', dictType: 'sys_oper_type', label: '修改', value: '2', cssClass: 'blue', orderNum: 2, status: '正常', createTime: '2024-01-05 10:00:00' },
  { id: '8', dictType: 'sys_oper_type', label: '删除', value: '3', cssClass: 'red', orderNum: 3, status: '正常', createTime: '2024-01-05 10:00:00' },
  { id: '9', dictType: 'sys_oper_type', label: '导出', value: '4', cssClass: 'orange', orderNum: 4, status: '正常', createTime: '2024-01-05 10:00:00' },
  { id: '10', dictType: 'sys_oper_type', label: '导入', value: '5', cssClass: 'blue', orderNum: 5, status: '正常', createTime: '2024-01-05 10:00:00' },
];

const DictDataPage: React.FC = () => {
  const [data] = useState<DictData[]>(mockData);
  const [loading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DictData | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<DictData> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '字典类型', dataIndex: 'dictType', key: 'dictType', width: 180, render: (type: string) => <Tag>{type}</Tag> },
    { title: '标签', dataIndex: 'label', key: 'label', width: 100 },
    { title: '值', dataIndex: 'value', key: 'value', width: 80 },
    { title: '样式', dataIndex: 'cssClass', key: 'cssClass', width: 100 },
    { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 60 },
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
  const handleEdit = (record: DictData) => { setEditingRecord(record); form.setFieldsValue(record); setModalOpen(true); };
  const handleDelete = (record: DictData) => {
    Modal.confirm({ title: '确认删除', content: `确定要删除字典数据 "${record.label}" 吗？`, onOk: () => message.success('删除成功') });
  };
  const handleModalOk = () => {
    form.validateFields().then(() => { message.success(editingRecord ? '更新成功' : '创建成功'); setModalOpen(false); });
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>字典数据</Title>
      <Card bordered={false}>
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={6}><Form.Item name="dictType" label="字典类型"><Input placeholder="请输入字典类型" allowClear /></Form.Item></Col>
            <Col span={6}><Form.Item name="label" label="标签"><Input placeholder="请输入标签" allowClear /></Form.Item></Col>
            <Col><Space><Button type="primary" icon={<SearchOutlined />}>搜索</Button><Button icon={<ReloadOutlined />}>重置</Button></Space></Col>
          </Row>
        </Form>
        <div style={{ marginBottom: 16 }}><Space><Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button></Space></div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title={editingRecord ? '编辑字典数据' : '新增字典数据'} open={modalOpen} onOk={handleModalOk} onCancel={() => setModalOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="dictType" label="字典类型" rules={[{ required: true }]}><Input placeholder="请输入字典类型" /></Form.Item>
          <Form.Item name="label" label="标签" rules={[{ required: true }]}><Input placeholder="请输入标签" /></Form.Item>
          <Form.Item name="value" label="值" rules={[{ required: true }]}><Input placeholder="请输入值" /></Form.Item>
          <Form.Item name="cssClass" label="样式"><Input placeholder="请输入样式" /></Form.Item>
          <Form.Item name="orderNum" label="排序"><Input placeholder="请输入排序" /></Form.Item>
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

export default DictDataPage;
