## 2025-05-15 - SSRF and DoS in Image Proxy
**Vulnerability:** Open image proxy allowed fetching any URL, including internal resources (SSRF), and was susceptible to DoS via hanging connections.
**Learning:** The proxy also leaked the `IMAGES_API_KEY` to arbitrary external servers since it was sent with every request regardless of the destination.
**Prevention:** Always implement domain whitelisting and fetch timeouts for proxy endpoints. Use `AbortController` in Node/Next.js for timeouts.
