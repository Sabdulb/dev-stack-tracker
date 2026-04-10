# Dev Stack Tracker

A project-scoped service and subscription tracker for developers. Track what you're paying for across all your projects — infrastructure, APIs, hosting, databases, and more.

**No backend. No accounts. Your data stays in your browser's localStorage.**

## Features

- **Project-based organization** — group services by project with color labels
- **Dashboard overview** — see total monthly/yearly spend at a glance, broken down by project and category
- **Full & per-project import/export** — JSON files with merge or replace options
- **Shareable links** — encode your stack as a URL and share a read-only view
- **Multi-currency** — USD, EUR, GBP display
- **Billing cycle support** — monthly, yearly, and one-time costs normalized to monthly totals

## Tech Stack

| Layer | Choice |
|-------|--------|
| Build | Vite + React + TypeScript |
| State | Zustand with localStorage persistence |
| Styling | Tailwind CSS v4 |
| Primitives | Radix UI (Dialog, Dropdown) |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Sabdulb/dev-stack-tracker.git
cd dev-stack-tracker

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Deploy

One-click deploy to Vercel or Netlify — just connect the repo. No environment variables required.

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE)
