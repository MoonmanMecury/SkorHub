## 2025-05-15 - Non-blocking Redirection Pattern
**Learning:** Browser-native `alert()` calls are blocking and jarring. Implementing a state-driven reactive countdown with a manual override ('Redirect Now') provides a much smoother UX and better accessibility.
**Action:** Replace all instances of `alert()` used for navigation/redirection with a custom `RedirectAlert` component that uses a non-blocking UI pattern.
