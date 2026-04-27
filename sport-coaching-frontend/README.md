# Sport Coaching Frontend

Modern Vue 3 (Composition API) frontend with TypeScript (strict), consuming a JWT-secured REST API.

## Tech Stack

- Vue 3 + Composition API
- TypeScript (strict)
- Vite
- Pinia
- Vue Router
- TailwindCSS
- Axios (interceptors)
- vue-toast-notification

## Project Structure

```text
src/
  components/
  layouts/
  pages/
  router/
    index.ts
    guards.ts
  services/
  stores/
  types/
  utils/
```

## Security (Route Guards)

All sensitive routes are protected through centralized router guards (no security logic in components):

- `authGuard`: redirects to `/login` when unauthenticated
- `roleGuard`: enforces RBAC based on `route.meta.roles`

Route meta example:

```ts
meta: {
  requiresAuth: true,
  roles: ['ADMIN']
}
```

## Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Set:

- `VITE_API_BASE_URL` (example: `http://localhost:4000/api`)

## Install & Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
