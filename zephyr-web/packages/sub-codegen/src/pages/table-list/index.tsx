import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Form, Row, Col, Typography, Modal, message, Checkbox } from 'antd';
import { SearchOutlined, ReloadOutlined, CodeOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface TableInfo {
  id: string;
  tableName: string;
  tableComment: string;
  className: string;
  packageName: string;
  author: string;
  createTime: string;
}

const mockData: TableInfo[] = [
  { id: '1', tableName: 'sys_user', tableComment: '用户表', className: 'SysUser', packageName: 'com.zephyr.system', author: 'admin', createTime: '2024-01-01 00:00:00' },
  { id: '2', tableName: 'sys_role', tableComment: '角色表', className: 'SysRole', packageName: 'com.zephyr.system', author: 'admin', createTime: '2024-01-01 00:00:00' },
  { id: '3', tableName: 'sys_menu', tableComment: '菜单表', className: 'SysMenu', packageName: 'com.zephyr.system', author: 'admin', createTime: '2024-01-01 00:00:00' },
  { id: '4', tableName: 'sys_dept', tableComment: '部门表', className: 'SysDept', packageName: 'com.zephyr.system', author: 'admin', createTime: '2024-01-01 00:00:00' },
  { id: '5', tableName: 'sys_dict_type', tableComment: '字典类型表', className: 'SysDictType', packageName: 'com.zephyr.system', author: 'admin', createTime: '2024-01-05 10:00:00' },
  { id: '6', tableName: 'sys_dict_data', tableComment: '字典数据表', className: 'SysDictData', packageName: 'com.zephyr.system', author: 'admin', createTime: '2024-01-05 10:00:00' },
  { id: '7', tableName: 'sys_oper_log', tableComment: '操作日志表', className: 'SysOperLog', packageName: 'com.zephyr.system', author: 'admin', createTime: '2024-01-08 14:00:00' },
  { id: '8', tableName: 'sys_login_log', tableComment: '登录日志表', className: 'SysLoginLog', packageName: 'com.zephyr.system', author: 'admin', createTime: '2024-01-08 14:00:00' },
  { id: '9', tableName: 'sys_endpoint', tableComment: '端点表', className: 'SysEndpoint', packageName: 'com.zephyr.system', author: 'admin', createTime: '2024-01-10 09:00:00' },
  { id: '10', tableName: 'biz_form_template', tableComment: '表单模板表', className: 'BizFormTemplate', packageName: 'com.zephyr.biz', author: 'admin', createTime: '2024-01-12 16:00:00' },
];

const TableListPage: React.FC = () => {
  const [data] = useState<TableInfo[]>(mockData);
  const [loading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewCode, setPreviewCode] = useState('');

  const columns: ColumnsType<TableInfo> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '表名', dataIndex: 'tableName', key: 'tableName', width: 180 },
    { title: '表描述', dataIndex: 'tableComment', key: 'tableComment', width: 150 },
    { title: '类名', dataIndex: 'className', key: 'className', width: 150 },
    { title: '包名', dataIndex: 'packageName', key: 'packageName', width: 200 },
    { title: '作者', dataIndex: 'author', key: 'author', width: 100 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作', key: 'action', width: 250,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>预览</Button>
          <Button type="link" size="small" icon={<CodeOutlined />} onClick={() => message.success('代码已生成')}>生成</Button>
          <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => message.success('下载成功')}>下载</Button>
        </Space>
      ),
    },
  ];

  const handlePreview = (record: TableInfo) => {
    const mockCode = `// ${record.className}.java
package ${record.packageName}.domain;

import com.zephyr.common.core.domain.BaseEntity;

public class ${record.className} extends BaseEntity {
    private Long id;
    private String name;
    private String status;
    // getters and setters
}`;
    setPreviewCode(mockCode);
    setPreviewVisible(true);
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>代码生成</Title>
      <Card bordered={false}>
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={6}><Form.Item name="tableName" label="表名"><Input placeholder="请输入表名" allowClear /></Form.Item></Col>
            <Col span={6}><Form.Item name="tableComment" label="描述"><Input placeholder="请输入描述" allowClear /></Form.Item></Col>
            <Col><Space><Button type="primary" icon={<SearchOutlined />}>搜索</Button><Button icon={<ReloadOutlined />}>重置</Button></Space></Col>
          </Row>
        </Form>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<CodeOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => message.success('批量生成成功')}>批量生成</Button>
            <Button icon={<DownloadOutlined />} disabled={selectedRowKeys.length === 0}>批量下载</Button>
          </Space>
        </div>
        <Table
          columns={columns} dataSource={data} loading={loading} rowKey="id"
          pagination={{ pageSize: 10 }}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal title="代码预览" open={previewVisible} onCancel={() => setPreviewVisible(false)} width={700} footer={null}>
        <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, fontSize: 13, overflow: 'auto', maxHeight: 500 }}>
          {previewCode}
        </pre>
      </Modal>
    </div>
  );
};

export default TableListPage;
