import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter } from 'react-router-dom';
import { themeConfig } from '@zephyr/shared';
import AppRouter from './router';

const App: React.FC = () => {
  return (
    <ConfigProvider theme={themeConfig} locale={zhCN}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
