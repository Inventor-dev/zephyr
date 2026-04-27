import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { themeConfig } from '@zephyr/shared';
import OperationLogPage from './pages/operation';
import LoginLogPage from './pages/login-log';

const App: React.FC = () => (
  <ConfigProvider theme={themeConfig} locale={zhCN}>
    <BrowserRouter>
      <Routes>
        <Route path="/operation" element={<OperationLogPage />} />
        <Route path="/login" element={<LoginLogPage />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);
export default App;
