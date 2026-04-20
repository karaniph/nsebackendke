# NSEinsider Frontend

Production frontend for `nseinsider.co.ke` built with Vite + React + TypeScript.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Giscus comments

Comments are wired through `giscus` on blog post pages.

1. Enable GitHub Discussions on the repository.
2. Use `https://giscus.app` to generate the repository and category IDs.
3. Copy `.env.example` to `.env` and fill in:

```bash
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
```

Without those values, comments stay disabled in production and show a setup hint only in development.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- React Query
