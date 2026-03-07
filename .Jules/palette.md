## 2025-05-15 - [Aria labels and hidden-until-hover elements]
**Learning:** Interactive elements that are hidden with `opacity-0` until hovered are inaccessible to keyboard users unless they are made visible on focus using `focus-visible:opacity-100`.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` for buttons that appear on hover.

## 2025-05-15 - [Material Symbols Fill State]
**Learning:** Standard Tailwind `fill-current` does not work with Google Material Symbols variable fonts; instead, `font-variation-settings: 'FILL' 1` must be used for a solid icon state.
**Action:** Use inline styles or a custom utility class for Material Symbols fill states.

## 2025-05-15 - [Semantic HTML for Nested Interactive Elements]
**Learning:** Nesting a `<button>` inside a Next.js `<Link>` (which renders an `<a>`) is invalid HTML and can cause unpredictable behavior in screen readers and keyboard navigation.
**Action:** Use a `<span>` styled like a button for purely visual interactive cues inside links.
