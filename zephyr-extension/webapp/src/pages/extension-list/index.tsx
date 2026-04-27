import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface Extension {
  id: string;
  name: string;
  code: string;
  description: string;
  type: string;
  status: string;
  implCount: number;
  createTime: string;
}

const mockData: Extension[] = [
  { id: '1', name: '认证扩展点', code: 'auth.extension', description: '自定义认证逻辑扩展', type: '认证', status: '启用', implCount: 3, createTime: '2024-01-01 00:00:00' },
  { id: '2', name: '授权扩展点', code: 'permission.extension', description: '自定义授权逻辑扩展', type: '授权', status: '启用', implCount: 2, createTime: '2024-01-01 00:00:00' },
  { id: '3', name: '日志扩展点', code: 'log.extension', description: '自定义日志记录扩展', type: '日志', status: '启用', implCount: 4, createTime: '2024-01-05 10:00:00' },
  { id: '4', name: '通知扩展点', code: 'notify.extension', description: '自定义通知发送扩展', type: '通知', status: '启用', implCount: 2, createTime: '2024-01-08 14:00:00' },
  { id: '5', name: '导出扩展点', code: 'export.extension', description: '自定义数据导出扩展', type: '导出', status: '停用', implCount: 1, createTime: '2024-01-10 09:00:00' },
  { id: '6', name: '报表扩展点', code: 'report.extension', description: '自定义报表生成扩展', type: '报表', status: '启用', implCount: 0, createTime: '2024-01-12 16:00:00' },
];

const ExtensionListPage: React.FC = () => {
  const [data] = useState<Extension[]>(mockData);
  const [loading] = useState(false);
  const navigate = useNavigate();

  const columns: ColumnsType<Extension> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '扩展点名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '扩展点编码', dataIndex: 'code', key: 'code', width: 180, render: (code: string) => <Tag color="blue">{code}</Tag> },
    { title: '描述', dataIndex: 'description', key: 'description', width: 250 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 80 },
    { title: '实现数', dataIndex: 'implCount', key: 'implCount', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status: string) => <Tag color={status === '启用' ? 'green' : 'red'}>{status}</Tag> },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作', key: 'action', width: 250,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate('/extension/detail')}>查看实现</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => message.info('编辑扩展点')}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => {
            Modal.confirm({ title: '确认删除', content: `确定要删除扩展点 "${record.name}" 吗？`, onOk: () => message.success('删除成功') });
          }}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>扩展点列表</Title>
      <Card bordered={false}>
        <div style={{ marginBottom: 16 }}><Space><Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('新增扩展点')}>新增</Button></Space></div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 1400 }} />
      </Card>
    </div>
  );
};

export default ExtensionListPage;
