---
name: slides
description: Create strategic HTML presentations with Chart.js, design tokens, responsive layouts, copywriting formulas, and contextual slide strategies.
argument-hint: "[topic] [slide-count]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# Slides

Strategic HTML presentation design with data visualization.

## UX Flow override (this repo — mandatory)

Slides are **standalone HTML artifacts** (pitch decks), not Vue app pages. Do **not** import Chart.js, slide CSS, or design-token CSS into UX Flow `src/`. See [package-interfaces.md](../ux-flow-compose/package-interfaces.md).

If the user wants a **presentation-like view inside the app**, rebuild with antdv (`Card`, `Typography`, `Statistic`, `Table`, `Steps`) and type with package interfaces:

```ts
import type { CardProps, StatisticProps } from 'ant-design-vue'
const card: CardProps = { title: 'خلاصه' }
const metric: StatisticProps = { title: 'نرخ تبدیل', value: 12.5, suffix: '%' }
```

## Package interfaces (mandatory) — when coding the app

In-app “slides” / summary UIs use antdv `*Props` / `ThemeConfig` — never Chart.js types in the Vue bundle unless the user explicitly adds that dependency.

## When to Use

- Marketing presentations and pitch decks
- Data-driven slides with Chart.js
- Strategic slide design with layout patterns
- Copywriting-optimized presentation content

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `create` | Create strategic presentation slides | `references/create.md` |

## References (Knowledge Base)

| Topic | File |
|-------|------|
| Layout Patterns | `references/layout-patterns.md` |
| HTML Template | `references/html-template.md` |
| Copywriting Formulas | `references/copywriting-formulas.md` |
| Slide Strategies | `references/slide-strategies.md` |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
