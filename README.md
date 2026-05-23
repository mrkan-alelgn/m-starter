# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## API Integration

The starter uses a small fetch wrapper in `src/api/client.js` and a central route table in `src/api/config.js`.

To connect a real backend:

1. Set `VITE_API_BASE_URL` in your environment.

```bash
VITE_API_BASE_URL=https://api.example.com/v1
```

2. Disable the development mocks when you want requests to reach that backend.

```bash
VITE_ENABLE_MSW=false
```

3. Match or edit the routes in `API_ROUTES`.

Each endpoint module calls `apiRequest(route, { accessToken, body, searchParams })`, so adding a real API is usually just changing the base URL and route paths. The shared client handles JSON headers, bearer tokens, query strings, response parsing, and API errors.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
