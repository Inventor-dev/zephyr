import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: ReactDOM.Root | null = null;

function render(props: any) {
  const { container } = props;
  const dom = container
    ? container.querySelector('#root')
    : document.getElementById('root');

  root = ReactDOM.createRoot(dom);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// 独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// 微前端生命周期
export async function bootstrap() {
  console.log('[sub-system] bootstrap');
}

export async function mount(props: any) {
  console.log('[sub-system] mount', props);
  render(props);
}

export async function unmount(props: any) {
  console.log('[sub-system] unmount');
  root?.unmount();
  root = null;
}

export async function update(props: any) {
  console.log('[sub-system] update', props);
}
