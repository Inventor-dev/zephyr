import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: ReactDOM.Root | null = null;

function render(props: any) {
  const { container } = props;
  const dom = container ? container.querySelector('#root') : document.getElementById('root');
  root = ReactDOM.createRoot(dom);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() { console.log('[sub-permission] bootstrap'); }
export async function mount(props: any) { console.log('[sub-permission] mount'); render(props); }
export async function unmount() { console.log('[sub-permission] unmount'); root?.unmount(); root = null; }
export async function update(props: any) { console.log('[sub-permission] update', props); }
