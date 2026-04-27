import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { themeConfig } from '@zephyr/shared';
import ExtensionListPage from './pages/extension-list';
import ExtensionDetailPage from './pages/extension-detail';

const App: React.FC = () => (
  <ConfigProvider theme={themeConfig} locale={zhCN}>
    <BrowserRouter>
      <Routes>
        <Route path="/list" element={<ExtensionListPage />} />
        <Route path="/detail" element={<ExtensionDetailPage />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);
export default App;
