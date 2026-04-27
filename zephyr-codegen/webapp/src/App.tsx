import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { themeConfig } from '@zephyr/shared';
import TableListPage from './pages/table-list';
import GenPreviewPage from './pages/gen-preview';

const App: React.FC = () => (
  <ConfigProvider theme={themeConfig} locale={zhCN}>
    <BrowserRouter>
      <Routes>
        <Route path="/tables" element={<TableListPage />} />
        <Route path="/preview" element={<GenPreviewPage />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);
export default App;
