import { geekblue } from '@ant-design/colors'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'

const primary = geekblue[5]
if (primary === undefined) {
  throw new Error('Missing @ant-design/colors geekblue[5]')
}

/** App-wide Ant Design Vue theme — tokens only, no custom CSS. */
export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: primary,
    borderRadius: 8,
    borderRadiusLG: 12,
    fontFamily: `'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    fontSize: 14,
    controlHeight: 36,
  },
  components: {
    Layout: {
      colorBgHeader: '#ffffff',
      colorBgBody: geekblue[0] ?? '#f0f5ff',
      colorBgTrigger: '#002140',
    },
    Menu: {
      colorItemBg: '#001529',
      colorSubItemBg: '#000c17',
    },
  },
}
