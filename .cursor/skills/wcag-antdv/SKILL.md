---
name: wcag-antdv
description: >
  WCAG-oriented checks for UX Flow ant-design-vue UI — contrast, labels, keyboard,
  focus. Use in Test phase, accessibility fixes, or contrast/WCAG checklist work.
  Prefer antdv Form/labels over custom ARIA.
---

# WCAG + ant-design-vue (UX Flow)

Target: practical **WCAG 2.1 AA** for Design Thinking Test tools and app chrome.

## Prefer antdv primitives

| Need | Use |
| ---- | --- |
| Form labels | `Form` / `FormItem` `label` + `Rule` |
| Dialogs | `Modal` / `Drawer` (focus trap built-in) |
| Feedback | `Alert` / `message` / `notification` |
| Icons-only buttons | `Button` + `aria-label` / meaningful `title` |

Do not invent parallel a11y component kits.

## Checks

1. Text contrast for custom colors (Prototype/Test modules) — use project contrast utils when present
2. Every input has a visible label (Persian)
3. Keyboard: Tab order through Menu, Steps, forms, Modal
4. Do not remove focus outlines via CSS (no SFC `<style>` anyway)
5. Images/icons: decorative icons `aria-hidden` when text already names the action

## RTL

Run [persian-rtl](../persian-rtl/SKILL.md) together — direction bugs often look like a11y bugs.

## Output when auditing

```markdown
### Failures (AA)
### Warnings
### Suggested antdv fixes
```

## Checklist

- [ ] Labels + `Rule` messages Persian
- [ ] Contrast checked for custom tokens
- [ ] Modal/Drawer keyboard OK
- [ ] No `v-html` of untrusted AI/storage HTML without sanitization policy
