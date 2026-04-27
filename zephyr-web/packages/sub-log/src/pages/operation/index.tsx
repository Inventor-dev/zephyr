import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Form, Row, Col, Typography, Select } from 'antd';
import { SearchOutlined, ReloadOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface OperationLog {
  id: string;
  module: string;
  action: string;
  operator: string;
  ip: string;
  location: string;
  status: string;
  message: string;
  time: string;
}

const mockData: OperationLog[] = [
  { id: '1', module: '用户管理', action: '新增', operator: 'admin', ip: '192.168.1.100', location: '本地', status: '成功', message: '新增用户张三', time: '2024-01-15 09:30:00' },
  { id: '2', module: '角色管理', action: '修改', operator: 'admin', ip: '192.168.1.100', location: '本地', status: '成功', message: '修改角色管理员权限', time: '2024-01-15 09:25:00' },
  { id: '3', module: '菜单管理', action: '删除', operator: 'zhangsan', ip: '192.168.1.101', location: '本地', status: '失败', message: '删除菜单失败：权限不足', time: '2024-01-15 09:20:00' },
  { id: '4', module: '数据字典', action: '导出', operator: 'admin', ip: '192.168.1.100', location: '本地', status: '成功', message: '导出字典数据', time: '2024-01-15 09:15:00' },
  { id: '5', module: '用户管理', action: '修改', operator: 'admin', ip: '192.168.1.100', location: '本地', status: '成功', message: '修改用户李四状态', time: '2024-01-15 09:10:00' },
  { id: '6', module: '日志管理', action: '删除', operator: 'admin', ip: '192.168.1.100', location: '本地', status: '成功', message: '清空30天前操作日志', time: '2024-01-15 09:05:00' },
  { id: '7', module: '系统配置', action: '修改', operator: 'admin', ip: '192.168.1.100', location: '本地', status: '成功', message: '更新系统参数', time: '2024-01-15 09:00:00' },
  { id: '8', module: '用户管理', action: '重置密码', operator: 'zhangsan', ip: '192.168.1.101', location: '本地', status: '成功', message: '重置用户王五密码', time: '2024-01-15 08:55:00' },
];

const OperationLogPage: React.FC = () => {
  const [data] = useState<OperationLog[]>(mockData);
  const [loading] = useState(false);

  const columns: ColumnsType<OperationLog> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '模块', dataIndex: 'module', key: 'module', width: 100 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 100 },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100 },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 140 },
    { title: '操作结果', dataIndex: 'status', key: 'status', width: 80, render: (status: string) => <Tag color={status === '成功' ? 'green' : 'red'}>{status}</Tag> },
    { title: '操作信息', dataIndex: 'message', key: 'message', width: 250, ellipsis: true },
    { title: '操作时间', dataIndex: 'time', key: 'time', width: 180 },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>操作日志</Title>
      <Card bordered={false}>
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={5}><Form.Item name="module" label="模块"><Input placeholder="请输入模块" allowClear /></Form.Item></Col>
            <Col span={5}><Form.Item name="operator" label="操作人"><Input placeholder="请输入操作人" allowClear /></Form.Item></Col>
            <Col span={5}><Form.Item name="status" label="结果">
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

export default OperationLogPage;
