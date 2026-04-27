import type { ThemeConfig } from 'antd';

/** Ant Design 5 主题配置 */
export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorLink: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 6,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji'`,
    fontSize: 14,
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
  },
  components: {
    Layout: {
      siderBg: '#001529',
      headerBg: '#ffffff',
      headerHeight: 56,
    },
    Menu: {
      darkItemBg: '#001529',
      darkSubMenuItemBg: '#000c17',
      darkItemSelectedBg: '#1677ff',
    },
    Table: {
      headerBg: '#fafafa',
      borderRadius: 6,
    },
    Card: {
      borderRadiusLG: 8,
    },
    Button: {
      borderRadius: 6,
    },
  },
};
