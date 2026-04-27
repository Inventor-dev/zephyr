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

if (!window.__POWERED_BY_QIANKUN__) render({});

export async function bootstrap() { console.log('[sub-dict] bootstrap'); }
export async function mount(props: any) { render(props); }
export async function unmount() { root?.unmount(); root = null; }
export async function update(props: any) { console.log('[sub-dict] update', props); }
