import { registerMicroApps, start as qiankunStart, setDefaultMountApp } from 'qiankun';
import { apps } from './apps';

/** 注册微前端子应用 */
export function registerMicroApps() {
  registerMicroApps(
    apps.map((app) => ({
      ...app,
      props: {
        routerBase: app.activeRule,
        ...(app.props || {}),
      },
    })),
    {
      beforeLoad: (app) => {
        console.log('[微前端] 加载子应用:', app.name);
      },
      beforeMount: (app) => {
        console.log('[微前端] 挂载子应用:', app.name);
      },
      afterUnmount: (app) => {
        console.log('[微前端] 卸载子应用:', app.name);
      },
    }
  );
}

/** 启动微前端 */
export function start() {
  qiankunStart({
    sandbox: {
      experimentalStyleIsolation: true,
    },
    prefetch: 'all',
  });
}

export { registerMicroApps as register, qiankunStart as startMicroApp };
