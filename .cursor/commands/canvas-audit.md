# Canvas audit

Produce a standalone architecture / security / phase audit as a **Cursor Canvas** when the user wants a visual artifact beside chat.

1. Read the built-in **canvas** skill before creating any `.canvas.tsx`
2. Use a canvas only for standalone analytical deliverables (phase map, security findings table, stack compliance matrix) — **not** for ordinary code fixes
3. Prefer Persian labels in the UI of the canvas when the audience is product
4. Do not put product app code in the canvas; link to `src/` paths instead
5. If canvas tooling is unavailable, fall back to a concise markdown audit
