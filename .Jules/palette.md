## 2026-04-18 - Replacing Blocking Alerts with Semantic UI
**Learning:** Browser-level `alert()` calls are intrusive and break the application's dark-themed aesthetic. Using a semantic, non-blocking UI with `aria-live` maintains user flow while remaining accessible.
**Action:** Prefer in-page notification components (like the refactored `RedirectAlert`) over native browser dialogs for all redirection and status feedback.
