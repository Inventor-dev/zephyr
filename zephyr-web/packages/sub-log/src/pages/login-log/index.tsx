import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Form, Row, Col, Typography, Select, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface LoginLog {
  id: string;
  username: string;
  ip: string;
  location: string;
  browser: string;
  os: string;
  status: string;
  message: string;
  time: string;
}

const mockData: LoginLog[] = [
  { id: '1', username: 'admin', ip: '192.168.1.100', location: '本地', browser: 'Chrome 120', os: 'Windows 10', status: '成功', message: '登录成功', time: '2024-01-15 09:30:00' },
  { id: '2', username: 'zhangsan', ip: '192.168.1.101', location: '本地', browser: 'Firefox 121', os: 'macOS', status: '成功', message: '登录成功', time: '2024-01-15 09:25:00' },
  { id: '3', username: 'lisi', ip: '10.0.0.50', location: '远程', browser: 'Chrome 120', os: 'Ubuntu', status: '失败', message: '密码错误', time: '2024-01-15 09:20:00' },
  { id: '4', username: 'admin', ip: '192.168.1.100', location: '本地', browser: 'Chrome 120', os: 'Windows 10', status: '成功', message: '登录成功', time: '2024-01-15 08:00:00' },
  { id: '5', username: 'wangwu', ip: '172.16.0.20', location: '远程', browser: 'Safari 17', os: 'iOS 17', status: '成功', message: '登录成功', time: '2024-01-14 18:30:00' },
  { id: '6', username: 'unknown', ip: '203.0.113.50', location: '美国', browser: 'Chrome 119', os: 'Windows 11', status: '失败', message: '账号不存在', time: '2024-01-14 15:00:00' },
];

const LoginLogPage: React.FC = () => {
  const [data] = useState<LoginLog[]>(mockData);
  const [loading] = useState(false);

  const columns: ColumnsType<LoginLog> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username', key: 'username', width: 100 },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 140 },
    { title: '登录地点', dataIndex: 'location', key: 'location', width: 100 },
    { title: '浏览器', dataIndex: 'browser', key: 'browser', width: 120 },
    { title: '操作系统', dataIndex: 'os', key: 'os', width: 120 },
    { title: '登录状态', dataIndex: 'status', key: 'status', width: 80, render: (status: string) => <Tag color={status === '成功' ? 'green' : 'red'}>{status}</Tag> },
    { title: '登录信息', dataIndex: 'message', key: 'message', width: 200 },
    { title: '登录时间', dataIndex: 'time', key: 'time', width: 180 },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>登录日志</Title>
      <Card bordered={false}>
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={5}><Form.Item name="username" label="用户名"><Input placeholder="请输入用户名" allowClear /></Form.Item></Col>
            <Col span={5}><Form.Item name="ip" label="IP地址"><Input placeholder="请输入IP" allowClear /></Form.Item></Col>
            <Col span={5}><Form.Item name="status" label="状态">
              <Select placeholder="请选择" allowClear>
                <Select.Option value="成功">成功</Select.Option>
                <Select.Option value="失败">失败</Select.Option>
              </Select>
            </Form.Item></Col>
            <Col><Space><Button type="primary" icon={<SearchOutlined />}>搜索</Button><Button icon={<ReloadOutlined />}>重置</Button></Space></Col>
          </Row>
        </Form>
        <div style={{ marginBottom: 16 }}><Space><Button danger icon={<DeleteOutlined />}>清空</Button><Button icon={<ExportOutlined />}>导出</Button></Space></div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }} scroll={{ x: 1400 }} />
      </Card>
    </div>
  );
};

export default LoginLogPage;
