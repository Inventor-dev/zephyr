import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { themeConfig } from '@zephyr/shared';
import UserPage from './pages/user';
import DeptPage from './pages/dept';
import EndpointPage from './pages/endpoint';

const App: React.FC = () => {
  return (
    <ConfigProvider theme={themeConfig} locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/user" element={<UserPage />} />
          <Route path="/dept" element={<DeptPage />} />
          <Route path="/endpoint" element={<EndpointPage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
