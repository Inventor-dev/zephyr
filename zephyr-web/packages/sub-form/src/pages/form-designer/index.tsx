import React, { useState } from 'react';
import { Card, Row, Col, List, Button, Typography, Space, Form, Input, Select, Switch, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const componentTypes = [
  { type: 'input', name: '输入框', icon: '📝' },
  { type: 'textarea', name: '多行文本', icon: '📄' },
  { type: 'select', name: '下拉选择', icon: '📋' },
  { type: 'radio', name: '单选按钮', icon: '🔘' },
  { type: 'checkbox', name: '复选框', icon: '☑️' },
  { type: 'datepicker', name: '日期选择', icon: '📅' },
  { type: 'timepicker', name: '时间选择', icon: '🕐' },
  { type: 'number', name: '数字输入', icon: '🔢' },
  { type: 'switch', name: '开关', icon: '🔀' },
  { type: 'upload', name: '文件上传', icon: '📎' },
];

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
}

const FormDesignerPage: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([
    { id: '1', type: 'input', label: '姓名', placeholder: '请输入姓名', required: true },
    { id: '2', type: 'select', label: '性别', placeholder: '请选择性别', required: true },
    { id: '3', type: 'datepicker', label: '出生日期', placeholder: '请选择日期', required: false },
  ]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const navigate = useNavigate();

  const handleAddField = (type: string) => {
    const newField: FormField = {
      id: String(Date.now()),
      type,
      label: componentTypes.find((c) => c.type === type)?.name || type,
      placeholder: '',
      required: false,
    };
    setFields([...fields, newField]);
    setSelectedField(newField);
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    if (selectedField?.id === id) setSelectedField(null);
  };

  const handleSave = () => {
    message.success('保存成功');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>表单设计器</Title>
        <Space>
          <Button onClick={() => navigate('/form/list')}>返回</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
        </Space>
      </div>

      <Row gutter={16}>
        {/* 组件列表 */}
        <Col span={4}>
          <Card title="组件列表" size="small" bordered={false}>
            <List
              dataSource={componentTypes}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: 'pointer', padding: '6px 8px' }}
                  onClick={() => handleAddField(item.type)}
                >
                  <Space>
                    <span>{item.icon}</span>
                    <Text>{item.name}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 表单预览 */}
        <Col span={14}>
          <Card title="表单预览" bordered={false}>
            <Form layout="vertical">
              {fields.map((field) => (
                <Form.Item
                  key={field.id}
                  label={field.label}
                  required={field.required}
                  style={{ cursor: 'pointer', background: selectedField?.id === field.id ? '#e6f7ff' : 'transparent', padding: 8, borderRadius: 4 }}
                  onClick={() => setSelectedField(field)}
                >
                  {field.type === 'input' && <Input placeholder={field.placeholder} />}
                  {field.type === 'textarea' && <Input.TextArea placeholder={field.placeholder} />}
                  {field.type === 'select' && (
                    <Select placeholder={field.placeholder} style={{ width: '100%' }}>
                      <Select.Option value="option1">选项1</Select.Option>
                      <Select.Option value="option2">选项2</Select.Option>
                    </Select>
                  )}
                  {field.type === 'datepicker' && <Input placeholder={field.placeholder} />}
                  {field.type === 'number' && <Input type="number" placeholder={field.placeholder} />}
                  {field.type === 'switch' && <Switch />}
                </Form.Item>
              ))}
            </Form>
          </Card>
        </Col>

        {/* 属性配置 */}
        <Col span={6}>
          <Card title="属性配置" size="small" bordered={false}>
            {selectedField ? (
              <Form layout="vertical">
                <Form.Item label="标签">
                  <Input
                    value={selectedField.label}
                    onChange={(e) => {
                      const updated = fields.map((f) => f.id === selectedField.id ? { ...f, label: e.target.value } : f);
                      setFields(updated);
                      setSelectedField({ ...selectedField, label: e.target.value });
                    }}
                  />
                </Form.Item>
                <Form.Item label="占位文本">
                  <Input
                    value={selectedField.placeholder}
                    onChange={(e) => {
                      const updated = fields.map((f) => f.id === selectedField.id ? { ...f, placeholder: e.target.value } : f);
                      setFields(updated);
                      setSelectedField({ ...selectedField, placeholder: e.target.value });
                    }}
                  />
                </Form.Item>
                <Form.Item label="必填">
                  <Switch
                    checked={selectedField.required}
                    onChange={(checked) => {
                      const updated = fields.map((f) => f.id === selectedField.id ? { ...f, required: checked } : f);
                      setFields(updated);
                      setSelectedField({ ...selectedField, required: checked });
                    }}
                  />
                </Form.Item>
                <Button danger icon={<DeleteOutlined />} block onClick={() => handleDeleteField(selectedField.id)}>
                  删除此字段
                </Button>
              </Form>
            ) : (
              <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>请选择一个字段</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FormDesignerPage;
