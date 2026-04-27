import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerMicroApps, start } from './qiankun';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 注册微前端子应用
registerMicroApps();
start();
