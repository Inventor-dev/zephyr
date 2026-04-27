import React from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import {
  UserOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

/** 统计卡片数据 */
const statistics = [
  {
    title: '用户总数',
    value: 1024,
    prefix: <UserOutlined style={{ color: '#1677ff' }} />,
    suffix: '人',
    color: '#e6f7ff',
    borderColor: '#1677ff',
    change: 12,
    isUp: true,
  },
  {
    title: '角色数量',
    value: 36,
    prefix: <SafetyCertificateOutlined style={{ color: '#52c41a' }} />,
    suffix: '个',
    color: '#f6ffed',
    borderColor: '#52c41a',
    change: 3,
    isUp: true,
  },
  {
    title: '在线用户',
    value: 89,
    prefix: <TeamOutlined style={{ color: '#faad14' }} />,
    suffix: '人',
    color: '#fffbe6',
    borderColor: '#faad14',
    change: 5,
    isUp: false,
  },
  {
    title: '今日操作',
    value: 2567,
    prefix: <FileTextOutlined style={{ color: '#ff4d4f' }} />,
    suffix: '次',
    color: '#fff2f0',
    borderColor: '#ff4d4f',
    change: 156,
    isUp: true,
  },
];

/** 最近操作日志 */
const recentLogs = [
  { key: '1', user: 'admin', action: '用户登录', module: '认证模块', time: '2024-01-15 09:30:00', ip: '192.168.1.100', status: '成功' },
  { key: '2', user: 'zhangsan', action: '新增用户', module: '系统管理', time: '2024-01-15 09:25:00', ip: '192.168.1.101', status: '成功' },
  { key: '3', user: 'lisi', action: '删除角色', module: '权限管理', time: '2024-01-15 09:20:00', ip: '192.168.1.102', status: '失败' },
  { key: '4', user: 'wangwu', action: '修改菜单', module: '菜单管理', time: '2024-01-15 09:15:00', ip: '192.168.1.103', status: '成功' },
  { key: '5', user: 'admin', action: '导出数据', module: '数据字典', time: '2024-01-15 09:10:00', ip: '192.168.1.100', status: '成功' },
  { key: '6', user: 'zhangsan', action: '修改密码', module: '认证模块', time: '2024-01-15 09:05:00', ip: '192.168.1.101', status: '成功' },
];

const columns: ColumnsType<typeof recentLogs[0]> = [
  { title: '操作用户', dataIndex: 'user', key: 'user', width: 100 },
  { title: '操作类型', dataIndex: 'action', key: 'action', width: 120 },
  { title: '所属模块', dataIndex: 'module', key: 'module', width: 120 },
  { title: '操作时间', dataIndex: 'time', key: 'time', width: 180 },
  { title: 'IP 地址', dataIndex: 'ip', key: 'ip', width: 140 },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (status: string) => (
      <Tag color={status === '成功' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        工作台
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statistics.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              bordered={false}
              style={{
                background: item.color,
                borderTop: `3px solid ${item.borderColor}`,
              }}
            >
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix}
                suffix={item.suffix}
                valueStyle={{ fontSize: 28, fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
                较昨日{' '}
                <span style={{ color: item.isUp ? '#52c41a' : '#ff4d4f' }}>
                  {item.isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {item.change}
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 最近操作日志 */}
      <Card title="最近操作" bordered={false}>
        <Table
          columns={columns}
          dataSource={recentLogs}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
