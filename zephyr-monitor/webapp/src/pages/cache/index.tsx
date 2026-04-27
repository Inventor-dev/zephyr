import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography, Button, Space, Descriptions } from 'antd';
import { ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

const cacheInfo = {
  info: 'Redis 7.2.3',
  commandStats: [
    { name: 'set', value: 1256 },
    { name: 'get', value: 8934 },
    { name: 'del', value: 432 },
    { name: 'expire', value: 1024 },
    { name: 'keys', value: 567 },
    { name: 'hset', value: 2345 },
    { name: 'hget', value: 4567 },
    { name: 'lpush', value: 234 },
    { name: 'rpush', value: 189 },
  ],
  dbSize: 1024,
  usedMemory: '12.5 MB',
  connectedClients: 5,
  uptime: '72h 30m',
};

const commandColumns: ColumnsType<typeof cacheInfo.commandStats[0]> = [
  { title: '命令', dataIndex: 'name', key: 'name', width: 120, render: (name: string) => <Tag color="blue">{name}</Tag> },
  { title: '调用次数', dataIndex: 'value', key: 'value', width: 120 },
];

const CachePage: React.FC = () => {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>缓存监控</Title>

      {/* 基本信息 */}
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Statistic title="缓存版本" value={cacheInfo.info} valueStyle={{ fontSize: 18 }} />
          </Col>
          <Col span={6}>
            <Statistic title="Key 数量" value={cacheInfo.dbSize} suffix="个" />
          </Col>
          <Col span={6}>
            <Statistic title="内存占用" value={cacheInfo.usedMemory} />
          </Col>
          <Col span={6}>
            <Statistic title="运行时间" value={cacheInfo.uptime} />
          </Col>
        </Row>
      </Card>

      {/* 操作按钮和命令统计 */}
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title="操作"
            bordered={false}
            extra={
              <Space>
                <Button icon={<ReloadOutlined />}>刷新</Button>
                <Button danger icon={<ClearOutlined />}>清空缓存</Button>
              </Space>
            }
          >
            <Descriptions column={1}>
              <Descriptions.Item label="已连接客户端">{cacheInfo.connectedClients} 个</Descriptions.Item>
              <Descriptions.Item label="已用内存">{cacheInfo.usedMemory}</Descriptions.Item>
              <Descriptions.Item label="Key 数量">{cacheInfo.dbSize} 个</Descriptions.Item>
              <Descriptions.Item label="运行时间">{cacheInfo.uptime}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="命令统计" bordered={false}>
            <Table columns={commandColumns} dataSource={cacheInfo.commandStats} rowKey="name" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CachePage;
