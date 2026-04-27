import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Space } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { setToken } from '@zephyr/shared';
import { useUser } from '../../store/user';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useUser();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Mock 登录
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (values.username === 'admin' && values.password === 'admin123') {
        const mockToken = 'mock_token_' + Date.now();
        setToken(mockToken);
        setUserInfo({
          id: '1',
          username: 'admin',
          nickname: '超级管理员',
          roles: ['admin'],
          permissions: ['*'],
        });
        message.success('登录成功');
        navigate('/dashboard');
      } else {
        message.error('用户名或密码错误');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1219 0%, #1a1f2e 50%, #0f1219 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景装饰 */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(125,211,252,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 登录卡片 */}
      <div
        style={{
          width: 420,
          padding: '48px 40px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              fontSize: 48,
              marginBottom: 12,
              background: 'linear-gradient(135deg, #7dd3fc, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            ⚡
          </div>
          <h1
            style={{
              color: '#fff',
              fontSize: 28,
              fontWeight: 'bold',
              margin: 0,
              letterSpacing: 2,
            }}
          >
            Zephyr
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 14,
              marginTop: 8,
              letterSpacing: 4,
            }}
          >
            和風·微風
          </p>
        </div>

        {/* 登录表单 */}
        <Form name="login" onFinish={onFinish} size="large" autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
              placeholder="用户名"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
              placeholder="密码"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
              }}
            />
          </Form.Item>

          <Form.Item
            name="captcha"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div style={{ display: 'flex', gap: 12 }}>
              <Input
                prefix={<SafetyCertificateOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                placeholder="验证码"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  flex: 1,
                }}
              />
              <div
                style={{
                  width: 120,
                  height: 40,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7dd3fc',
                  fontSize: 18,
                  fontWeight: 'bold',
                  letterSpacing: 6,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                A3K7
              </div>
            </div>
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Checkbox style={{ color: 'rgba(255,255,255,0.6)' }}>记住我</Checkbox>
              <a style={{ color: '#7dd3fc', fontSize: 13 }}>忘记密码？</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 44,
                fontSize: 16,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #7dd3fc, #0ea5e9)',
                border: 'none',
              }}
            >
              登 录
            </Button>
          </Form.Item>
        </Form>

        {/* 底部提示 */}
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 16 }}>
          默认账号: admin / admin123
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
