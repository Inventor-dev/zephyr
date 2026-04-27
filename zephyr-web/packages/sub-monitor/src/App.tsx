import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { themeConfig } from '@zephyr/shared';
import OnlinePage from './pages/online';
import CachePage from './pages/cache';

const App: React.FC = () => (
  <ConfigProvider theme={themeConfig} locale={zhCN}>
    <BrowserRouter>
      <Routes>
        <Route path="/online" element={<OnlinePage />} />
        <Route path="/cache" element={<CachePage />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);
export default App;
