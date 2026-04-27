import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Modal, message, Descriptions, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface ExtensionImpl {
  id: string;
  name: string;
  className: string;
  orderNum: number;
  status: string;
  description: string;
  createTime: string;
}

const mockImplementations: ExtensionImpl[] = [
  { id: '1', name: 'JWT认证实现', className: 'com.zephyr.auth.JwtAuthExtension', orderNum: 1, status: '启用', description: '基于JWT的认证实现', createTime: '2024-01-01 00:00:00' },
  { id: '2', name: 'OAuth2认证实现', className: 'com.zephyr.auth.OAuth2AuthExtension', orderNum: 2, status: '启用', description: '基于OAuth2的认证实现', createTime: '2024-01-05 10:00:00' },
  { id: '3', name: 'LDAP认证实现', className: 'com.zephyr.auth.LdapAuthExtension', orderNum: 3, status: '停用', description: '基于LDAP的认证实现', createTime: '2024-01-08 14:00:00' },
];

const ExtensionDetailPage: React.FC = () => {
  const [data] = useState<ExtensionImpl[]>(mockImplementations);
  const [loading] = useState(false);
  const navigate = useNavigate();

  const columns: ColumnsType<ExtensionImpl> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '实现名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '实现类', dataIndex: 'className', key: 'className', width: 350, render: (code: string) => <Tag>{code}</Tag> },
    { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 60 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status: string) => <Tag color={status === '启用' ? 'green' : 'red'}>{status}</Tag> },
    { title: '描述', dataIndex: 'description', key: 'description', width: 200 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作', key: 'action', width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => message.info('编辑实现')}>编辑</Button>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger onClick={() => {
            Modal.confirm({ title: '确认删除', content: `确定要删除实现 "${record.name}" 吗？`, onOk: () => message.success('删除成功') });
          }}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/extension/list')}>返回</Button>
          <Title level={4} style={{ margin: 0 }}>扩展点实现管理 - 认证扩展点</Title>
        </Space>
      </div>

      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="扩展点名称">认证扩展点</Descriptions.Item>
          <Descriptions.Item label="扩展点编码"><Tag color="blue">auth.extension</Tag></Descriptions.Item>
          <Descriptions.Item label="类型">认证</Descriptions.Item>
          <Descriptions.Item label="描述">自定义认证逻辑扩展</Descriptions.Item>
          <Descriptions.Item label="状态"><Tag color="green">启用</Tag></Descriptions.Item>
          <Descriptions.Item label="实现数量">3 个</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card bordered={false}>
        <div style={{ marginBottom: 16 }}><Space><Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('新增实现')}>新增实现</Button></Space></div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={false} scroll={{ x: 1400 }} />
      </Card>
    </div>
  );
};

export default ExtensionDetailPage;
