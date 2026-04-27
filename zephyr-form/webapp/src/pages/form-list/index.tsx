import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fieldCount: number;
  status: string;
  createTime: string;
  updateTime: string;
}

const mockData: FormTemplate[] = [
  { id: '1', name: '用户注册表单', description: '用户注册信息收集表单', fieldCount: 8, status: '启用', createTime: '2024-01-10 10:00:00', updateTime: '2024-01-15 14:00:00' },
  { id: '2', name: '意见反馈表单', description: '用户反馈信息收集表单', fieldCount: 5, status: '启用', createTime: '2024-01-12 14:00:00', updateTime: '2024-01-14 16:00:00' },
  { id: '3', name: '请假申请表单', description: '员工请假审批流程表单', fieldCount: 6, status: '启用', createTime: '2024-01-13 09:00:00', updateTime: '2024-01-15 10:00:00' },
  { id: '4', name: '报销申请表单', description: '财务报销审批流程表单', fieldCount: 10, status: '停用', createTime: '2024-01-14 11:00:00', updateTime: '2024-01-14 11:00:00' },
  { id: '5', name: '会议预约表单', description: '会议室预约申请表单', fieldCount: 4, status: '启用', createTime: '2024-01-15 08:00:00', updateTime: '2024-01-15 08:00:00' },
];

const FormListPage: React.FC = () => {
  const [data] = useState<FormTemplate[]>(mockData);
  const [loading] = useState(false);
  const navigate = useNavigate();

  const columns: ColumnsType<FormTemplate> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '表单名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '描述', dataIndex: 'description', key: 'description', width: 250 },
    { title: '字段数', dataIndex: 'fieldCount', key: 'fieldCount', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status: string) => <Tag color={status === '启用' ? 'green' : 'red'}>{status}</Tag> },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 180 },
    {
      title: '操作', key: 'action', width: 250,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate('/form/designer')}>设计</Button>
          <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => message.success('复制成功')}>复制</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => {
            Modal.confirm({ title: '确认删除', content: `确定要删除表单 "${record.name}" 吗？`, onOk: () => message.success('删除成功') });
          }}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>表单模板</Title>
      <Card bordered={false}>
        <div style={{ marginBottom: 16 }}><Space><Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/form/designer')}>新增表单</Button></Space></div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 1400 }} />
      </Card>
    </div>
  );
};

export default FormListPage;
