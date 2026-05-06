## 2025-05-15 - Centralized Favorites State Management
**Learning:** Initializing state from `localStorage` inside `useEffect` triggers a `react-hooks/set-state-in-effect` linting error because it causes a cascading render. Furthermore, when used in hooks across multiple components, it results in redundant IO and network synchronization.
**Action:** Use the `useState` initializer function to read from `localStorage` synchronously on the client, and wrap state in a React Context Provider to share it across the component tree, ensuring initialization and synchronization logic run only once.
