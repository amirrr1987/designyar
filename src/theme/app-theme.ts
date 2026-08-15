import { geekblue } from '@ant-design/colors'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'

const primary = geekblue[5]
if (primary === undefined) {
  throw new Error('Missing @ant-design/colors geekblue[5]')
}

/** Shared with Layout header and sidebar menu background. */
export const APP_HEADER_BG = '#ffffff'

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
      colorBgHeader: APP_HEADER_BG,
      colorBgBody: geekblue[0] ?? '#f0f5ff',
      colorBgTrigger: '#002140',
    },
    Menu: {
      colorItemBg: APP_HEADER_BG,
      colorSubItemBg: APP_HEADER_BG,
    },
  },
}
