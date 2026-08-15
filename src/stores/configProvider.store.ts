import enUS from 'ant-design-vue/es/locale/en_US'
import faIR from 'ant-design-vue/es/locale/fa_IR'
import type {  MappingAlgorithm, SizeType, ThemeConfig } from "ant-design-vue/es/config-provider/context"
import type { AliasToken, OverrideToken } from "ant-design-vue/es/theme/interface"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import type { Locale } from "ant-design-vue/es/locale"

export const useConfigProviderStore = defineStore('configProvider', () => {
  const token = ref<Partial<AliasToken>>({
    fontFamily: 'Vazirmatn',
  })
  const components = ref<OverrideToken>();
  const algorithm = ref<MappingAlgorithm | MappingAlgorithm[]>()
  const hashed = ref<boolean>()
  const inherit = ref<boolean>()

  const componentSize = ref<SizeType>()
  const lang = ref<'fa' | 'en'>('fa')
  const direction = ref<'rtl' | 'ltr'>('rtl')

  const locale = computed<Locale>(() => {
    return lang.value === 'fa' ? faIR : enUS
  })

  const theme = computed<ThemeConfig>(() => {
    return {
      token: token.value,
      components: components.value,
      algorithm: algorithm.value,
      hashed: hashed.value,
      inherit: inherit.value,
    }
  })
  return {
    theme,
    componentSize,
    locale,
    direction,
  }
})