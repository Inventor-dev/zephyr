/** 子应用配置 */
export interface SubAppConfig {
  name: string;
  entry: string;
  container: string;
  activeRule: string;
  props?: Record<string, any>;
}

/** 子应用列表 */
export const apps: SubAppConfig[] = [
  {
    name: 'sub-system',
    entry: '//localhost:7101',
    container: '#sub-app-container',
    activeRule: '/system',
  },
  {
    name: 'sub-permission',
    entry: '//localhost:7103',
    container: '#sub-app-container',
    activeRule: '/permission',
  },
  {
    name: 'sub-dict',
    entry: '//localhost:7104',
    container: '#sub-app-container',
    activeRule: '/dict',
  },
  {
    name: 'sub-log',
    entry: '//localhost:7105',
    container: '#sub-app-container',
    activeRule: '/log',
  },
  {
    name: 'sub-monitor',
    entry: '//localhost:7106',
    container: '#sub-app-container',
    activeRule: '/monitor',
  },
  {
    name: 'sub-codegen',
    entry: '//localhost:7107',
    container: '#sub-app-container',
    activeRule: '/codegen',
  },
  {
    name: 'sub-form',
    entry: '//localhost:7111',
    container: '#sub-app-container',
    activeRule: '/form',
  },
  {
    name: 'sub-extension',
    entry: '//localhost:7112',
    container: '#sub-app-container',
    activeRule: '/extension',
  },
];
