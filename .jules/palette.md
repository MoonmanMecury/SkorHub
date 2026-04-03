## 2026-03-04 - Search Keyboard Navigation Wrap-around
**Learning:** When starting with a navigation index of -1, the standard `(prev - 1 + length) % length` modulo arithmetic incorrectly resolves to `length - 2` instead of `length - 1` for the first 'ArrowUp' press.
**Action:** Use an explicit conditional `prev <= 0 ? length - 1 : prev - 1` for 'ArrowUp' to ensure the user wraps around to the last item correctly from an unselected state.
