import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { themeConfig } from '@zephyr/shared';
import DictTypePage from './pages/dict-type';
import DictDataPage from './pages/dict-data';

const App: React.FC = () => (
  <ConfigProvider theme={themeConfig} locale={zhCN}>
    <BrowserRouter>
      <Routes>
        <Route path="/type" element={<DictTypePage />} />
        <Route path="/data" element={<DictDataPage />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);

export default App;
