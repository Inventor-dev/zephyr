import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Modal, message } from 'antd';
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface OnlineUser {
  id: string;
  username: string;
  ip: string;
  location: string;
  browser: string;
  os: string;
  loginTime: string;
  lastAccess: string;
}

const mockData: OnlineUser[] = [
  { id: '1', username: 'admin', ip: '192.168.1.100', location: '本地', browser: 'Chrome 120', os: 'Windows 10', loginTime: '2024-01-15 09:30:00', lastAccess: '2024-01-15 10:15:00' },
  { id: '2', username: 'zhangsan', ip: '192.168.1.101', location: '本地', browser: 'Firefox 121', os: 'macOS', loginTime: '2024-01-15 09:25:00', lastAccess: '2024-01-15 10:10:00' },
  { id: '3', username: 'lisi', ip: '10.0.0.50', location: '远程', browser: 'Chrome 120', os: 'Ubuntu', loginTime: '2024-01-15 08:00:00', lastAccess: '2024-01-15 10:05:00' },
  { id: '4', username: 'wangwu', ip: '172.16.0.20', location: '远程', browser: 'Safari 17', os: 'iOS 17', loginTime: '2024-01-14 18:30:00', lastAccess: '2024-01-15 09:45:00' },
  { id: '5', username: 'zhaoliu', ip: '192.168.1.102', location: '本地', browser: 'Edge 120', os: 'Windows 11', loginTime: '2024-01-15 09:00:00', lastAccess: '2024-01-15 10:00:00' },
];

const OnlinePage: React.FC = () => {
  const [data] = useState<OnlineUser[]>(mockData);
  const [loading] = useState(false);

  const columns: ColumnsType<OnlineUser> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username', key: 'username', width: 100 },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 140 },
    { title: '登录地点', dataIndex: 'location', key: 'location', width: 100 },
    { title: '浏览器', dataIndex: 'browser', key: 'browser', width: 120 },
    { title: '操作系统', dataIndex: 'os', key: 'os', width: 120 },
    { title: '登录时间', dataIndex: 'loginTime', key: 'loginTime', width: 180 },
    { title: '最后访问', dataIndex: 'lastAccess', key: 'lastAccess', width: 180 },
    {
      title: '操作', key: 'action', width: 100,
      render: (_, record) => (
        <Button type="link" size="small" danger onClick={() => {
          Modal.confirm({ title: '确认强退', content: `确定要强退用户 "${record.username}" 吗？`, onOk: () => message.success('强退成功') });
        }}>强退</Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>在线用户</Title>
      <Card bordered={false}>
        <div style={{ marginBottom: 16 }}><Space><Button icon={<ReloadOutlined />}>刷新</Button></Space></div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
};

export default OnlinePage;
