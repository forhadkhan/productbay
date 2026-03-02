# ProductBay Documentation

This is the official documentation site for [ProductBay](https://wpanchorbay.com/productbay)

## Requirements

- **Node.js** 18+
- **npm** 8+

## Getting Started

Install dependencies (first time only):

```bash
cd docs
npm install
```

### Start Dev Server

```bash
npm run docs:dev
```

### Build for Production

```bash
npm run docs:build
```

Output is written to `.vitepress/dist/`.

### Preview Production Build

```bash
npm run docs:preview
```

## Deployment

The docs are automatically deployed to **GitHub Pages** whenever changes to the `docs/` directory are pushed to the `main` branch, via the workflow at [`.github/workflows/docs.yml`](../.github/workflows/docs.yml).

To enable GitHub Pages on your repository:
1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**

## Structure

```
docs/
├── .vitepress/         # VitePress config and custom theme
├── public/             # Static assets (logo, icon, screenshots)
├── guide/              # Getting started guides
├── features/           # Feature documentation
├── settings/           # Plugin settings reference
├── developer/          # Developer reference (architecture, REST API)
├── index.md            # Home / landing page
├── faq.md
├── changelog.md
└── feature-request.md
```
