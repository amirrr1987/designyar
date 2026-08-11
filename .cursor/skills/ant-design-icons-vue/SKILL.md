---
name: ant-design-icons-vue
description: >
  Guides @ant-design/icons-vue usage in this UX Flow Vue 3 + ant-design-vue project —
  tree-shaken icon imports, slotting into Button/Menu/Steps, and mapping Design Thinking
  step icon names. Use when adding icons, Outlined/Filled icons, Menu items, Steps,
  or @ant-design/icons-vue.
---

# @ant-design/icons-vue (UX Flow)

Package: `@ant-design/icons-vue` ^7. Icons only from this package — **no emoji** as UI icons. Works with PascalCase antdv components ([ant-design-vue](../ant-design-vue/SKILL.md)).

## Import (tree-shaken)

```ts
import {
  HeartOutlined,
  AimOutlined,
  BulbOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
```

Import **named icons only** — never a full barrel of every icon.

## Usage with antdv

```vue
<script setup lang="ts">
import { Button, Menu, MenuItem } from 'ant-design-vue'
import { PlusOutlined, HeartOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <Button type="primary">
    <template #icon><PlusOutlined /></template>
    افزودن
  </Button>

  <Menu mode="inline">
    <MenuItem key="empathize">
      <HeartOutlined />
      <span>همدلی</span>
    </MenuItem>
  </Menu>
</template>
```

## Design Thinking icon map

Match `constants/design-thinking-steps.ts` string names to components:

| key | Icon component |
|-----|----------------|
| empathize | `HeartOutlined` |
| define | `AimOutlined` |
| ideate | `BulbOutlined` |
| prototype | `ExperimentOutlined` |
| test | `CheckCircleOutlined` |

```ts
import * as Icons from '@ant-design/icons-vue'
import type { Component } from 'vue'

const iconMap: Record<string, Component> = {
  HeartOutlined: Icons.HeartOutlined,
  AimOutlined: Icons.AimOutlined,
  // …
}

function resolveIcon(name: string): Component {
  return iconMap[name] ?? Icons.QuestionCircleOutlined
}
```

## Package interfaces (mandatory)

Icons are Vue components from the package — type maps and slots with Vue + antdv types, not `any`. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

| Need | Type |
|------|------|
| Icon component | `FunctionalComponent` / `Component` from `vue` |
| Icon map | `Record<string, Component>` or better `satisfies Record<DesignStepIconName, Component>` |
| Button icon slot parent | antdv `ButtonProps` when configuring the host button |

```ts
import type { Component } from 'vue'
import type { ButtonProps } from 'ant-design-vue'
import { PlusOutlined, HeartOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'

const iconMap = {
  HeartOutlined,
  PlusOutlined,
} as const satisfies Record<string, Component>

function resolveIcon(name: string): Component {
  return iconMap[name as keyof typeof iconMap] ?? QuestionCircleOutlined
}

const addBtn: ButtonProps = { type: 'primary' }
```

Prefer an explicit typed map over `Icons[name]` without narrowing.

## Rules

1. Outlined variants by default for navigation; Filled only when antdv patterns call for it.
2. Size/color via parent antdv props / theme — not custom CSS on SVG.
3. Place icons in `#icon` slots or as children beside Persian labels.
4. Keep imports per-file minimal.
5. Type icon registries with `Component` / `satisfies` — no `any`.

## Checklist

- [ ] Named import from `@ant-design/icons-vue`
- [ ] Icon maps typed (`Component` / `satisfies`)
- [ ] No emoji icons in UI
- [ ] Wired into `Button` / `Menu` / `Steps` correctly (host props use antdv `*Props` when built as objects)
- [ ] Step icons resolve from Design Thinking constants
