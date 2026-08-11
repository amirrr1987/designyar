---
name: ant-design-vue
description: >
  Guides Ant Design Vue (antdv) v4 UI for this UX Flow project — named imports from
  ant-design-vue, PascalCase tags like Button, no custom CSS, ConfigProvider RTL/fa_IR,
  @ant-design/icons-vue, and @ant-design/colors. Use when building or debugging UI with
  ant-design-vue, antdv, Button, Form, Layout, ConfigProvider, icons-vue, or Persian RTL.
---

# Ant Design Vue (UX Flow)

Stack: Vue 3 + TypeScript + **ant-design-vue 4.x**. Docs: [overview](https://antdv.com/components/overview).

This project skill overrides global antdv habits: **barrel named imports** and **PascalCase** tags. Do not use `a-*` tags.

## Hard rules (no custom CSS)

1. **NEVER** write `<style>` blocks, custom CSS classes, or external CSS libraries.
2. Style only via antdv props (`type`, `size`, `variant`, `layout`, `gutter`, etc.).
3. Spacing/layout: `Space`, `Row`/`Col`, `Divider` — not custom margins.
4. Exception: `:style` **only** for dynamic color bindings (e.g. contrast preview `{ backgroundColor: color }`).
5. Icons from `@ant-design/icons-vue` only — no emoji as UI icons.
6. Prefer antdv components from the allowed list before inventing custom UI.

## Import strategy (required)

```ts
import { Button, Form, FormItem, Input, Layout, Menu, Steps, ConfigProvider } from 'ant-design-vue'
import { HeartOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { ButtonProps } from 'ant-design-vue'
```

In `<script setup>`, PascalCase imports map 1:1 in template:

```vue
<script setup lang="ts">
import { Button, Space } from 'ant-design-vue'
</script>

<template>
  <Space>
    <Button type="primary">ذخیره</Button>
    <Button>انصراف</Button>
  </Space>
</template>
```

Do **not** default to `ant-design-vue/es/...` in this project. Do **not** rely on `app.use(Antd)` + `a-button`.

Setup once in `main.ts`:

```ts
import 'ant-design-vue/dist/reset.css'
```

Register components via named imports in each SFC (or a thin local re-export). Static APIs:

```ts
import { message, Modal, notification } from 'ant-design-vue'
```

## RTL & Persian

Wrap the app with `ConfigProvider`:

```vue
<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import faIR from 'ant-design-vue/es/locale/fa_IR'
import type { ThemeConfig } from 'ant-design-vue'
</script>

<template>
  <ConfigProvider :locale="faIR" direction="rtl" component-size="middle">
    <RouterView />
  </ConfigProvider>
</template>
```

Also set `lang="fa"` and `dir="rtl"` on `<html>` (e.g. `index.html` / `document.documentElement`).

All user-facing copy must be **Persian**.

## Colors

Use `@ant-design/colors` or antdv theme tokens when you need palette scales — not ad-hoc CSS color systems. Dynamic previews may use `:style` bindings only.

```ts
import { blue, red } from '@ant-design/colors'
```

## Allowed components (PascalCase)

| Area | Components |
|------|------------|
| Layout | `Layout`, `Layout.Sider`, `Layout.Header`, `Layout.Content`, `Layout.Footer` |
| Navigation | `Menu`, `Menu.Item`, `Breadcrumb`, `Steps`, `Steps.Step` |
| Data entry | `Form`, `Form.Item` / `FormItem`, `Input`, `InputNumber`, `Select`, `Checkbox`, `Radio`, `Switch`, `Slider`, `DatePicker`, `Textarea`, `Rate` |
| Data display | `Card`, `Table`, `List`, `Tag`, `Badge`, `Avatar`, `Statistic`, `Descriptions`, `Tree`, `Collapse`, `Tabs` |
| Feedback | `Alert`, `Modal`, `message`, `notification`, `Progress`, `Result`, `Spin` |
| Actions | `Button`, `Button.Group` |
| Grid | `Row`, `Col` |
| Other | `Divider`, `Space`, `Tooltip`, `Popconfirm`, `Drawer`, `ConfigProvider` |

## v-model map (v4)

| Component | Binding |
|-----------|---------|
| Input, Textarea, Select, Cascader, TreeSelect, Radio.Group | `v-model:value` |
| InputNumber | `v-model:value` |
| Checkbox, Switch | `v-model:checked` |
| Modal, Drawer, Dropdown, Tooltip, Popover | `v-model:open` |
| Tabs, Collapse, Steps | `v-model:activeKey` |
| Upload | `v-model:file-list` |
| Menu | `v-model:selectedKeys` / `openKeys` |

Use `open`, not deprecated `visible`.

## Type-safe patterns

```ts
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import type { TableColumnsType } from 'ant-design-vue'

const formRef = ref<FormInstance>()
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'الزامی است' }],
}
```

```vue
<Form layout="vertical" :model="model" :rules="rules" @finish="onSubmit">
  <FormItem label="نام" name="name">
    <Input v-model:value="model.name" />
  </FormItem>
  <Button type="primary" html-type="submit">ثبت</Button>
</Form>
```

## Related project skills

- [ant-design-icons-vue](../ant-design-icons-vue/SKILL.md)
- [ant-design-colors](../ant-design-colors/SKILL.md)
- [vue](../vue/SKILL.md)
- [ux-flow](../ux-flow/SKILL.md)

## Checklist

- [ ] Named import from `ant-design-vue`
- [ ] PascalCase tags (`<Button>`, not `<a-button>`)
- [ ] No `<style>` / custom CSS classes
- [ ] Layout via `Space` / `Row` / `Col` / `Divider`
- [ ] Icons from `@ant-design/icons-vue`
- [ ] RTL + `fa_IR` via `ConfigProvider`
- [ ] Persian UI text
- [ ] v4 bindings (`open`, `v-model:value`, …)
