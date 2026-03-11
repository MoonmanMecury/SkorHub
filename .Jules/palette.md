## 2025-05-22 - Improving Favorite Button Accessibility and Interactivity

**Learning:**
1. Material Symbols used in this project require `font-variation-settings: "'FILL' 1"` to toggle the filled state; standard CSS `fill-current` is ineffective for font-based icons.
2. Interactive elements that are visually hidden by default (e.g., using `opacity-0` for hover-only buttons) must include `focus-visible:opacity-100` to ensure they are accessible to keyboard users.
3. Nesting `<button>` elements inside Next.js `<Link>` (which renders as an `<a>`) is invalid HTML and can cause issues with screen readers and event bubbling; using a styled `<span>` for decorative actions within links is a safer alternative.

**Action:** Always include `aria-label`, `aria-pressed`, and `focus-visible` visibility/ring classes for icon-only buttons. Use `font-variation-settings` for state changes in Material Symbols. Ensure interactive elements are not nested within links.
