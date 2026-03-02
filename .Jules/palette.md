## 2025-05-14 - Material Symbols and Redirection UX

**Learning:**
- The project uses Material Symbols which do not respect Tailwind's `fill-current` for the filled state. Instead, they require explicit `font-variation-settings: 'FILL' 1` to display solid icons.
- Using native `window.alert()` for redirection messages is a poor UX pattern as it's blocking and lacks accessibility controls. A dedicated UI component with `role="status"` and `aria-live="polite"` provides a much smoother and more accessible experience.

**Action:**
- Always use `style={{ fontVariationSettings: "'FILL' 1" }}` for filled Material Symbols.
- Replace blocking alerts with non-blocking UI notifications that use a timed delay before navigation.
