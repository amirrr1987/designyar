---
name: ant-design-colors
description: >
  Guides use of @ant-design/colors palette scales in this UX Flow Vue project —
  generating Ant Design color ramps, primary/accent tokens, and dynamic color
  previews without custom CSS. Use when working with @ant-design/colors, color
  palettes, design tokens, ColorPalette, contrast previews, or Ant Design color scales.
---

# @ant-design/colors (UX Flow)

Package: `@ant-design/colors` ^8. Use for Ant Design–compatible color ramps in Prototype / Test modules. Do not invent CSS color systems or `<style>` blocks — pair with the [ant-design-vue](../ant-design-vue/SKILL.md) skill.

## Import

```ts
import { blue, red, green, gold, volcano, orange, yellow, lime, cyan, geekblue, purple, magenta, grey, generate } from '@ant-design/colors'
```

Each named export is a **10-step** string array (index `0` lightest → `9` darkest). Primary-like shade is typically index `5` or `6`.

## Patterns

### Preset ramp

```ts
const primary = blue[5]
const primaryHover = blue[4]
const primaryActive = blue[6]
```

### Generate from a hex seed

```ts
const ramp = generate('#1890ff') // string[10]
```

### Persist in design system store

```ts
import { useStorage } from '@vueuse/core'
import { blue, generate } from '@ant-design/colors'

const designSystem = useStorage('ux-flow-design-system', {
  primaryRamp: blue,
  customRamp: generate('#52c41a'),
})
```

### Dynamic preview (only allowed `:style` use)

```vue
<script setup lang="ts">
import { blue } from '@ant-design/colors'
import { Card, Space, Tag } from 'ant-design-vue'
</script>

<template>
  <Space wrap>
    <Tag v-for="(c, i) in blue" :key="i" :style="{ backgroundColor: c, color: i > 4 ? '#fff' : undefined, border: 'none' }">
      {{ i }}
    </Tag>
  </Space>
</template>
```

## Rules

1. Prefer named ramps (`blue`, `red`, …) or `generate(hex)` — not hand-picked one-off hex sprawl.
2. Feed ramps into Pinia / `useStorage` design-system state; UI shows them via antdv (`Tag`, `Card`, color inputs).
3. For contrast checks, pass ramp hex strings into utils — do not style with custom CSS classes.
4. Align semantic steps with Design Thinking colors in `constants/design-thinking-steps.ts` when needed.

## Checklist

- [ ] Import from `@ant-design/colors`
- [ ] Use 10-step ramps or `generate`
- [ ] No custom CSS palette files
- [ ] Dynamic color via `:style` binding only when previewing
