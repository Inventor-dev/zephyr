import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { themeConfig } from '@zephyr/shared';
import FormListPage from './pages/form-list';
import FormDesignerPage from './pages/form-designer';

const App: React.FC = () => (
  <ConfigProvider theme={themeConfig} locale={zhCN}>
    <BrowserRouter>
      <Routes>
        <Route path="/list" element={<FormListPage />} />
        <Route path="/designer" element={<FormDesignerPage />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);
export default App;
