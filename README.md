# house-ui

The shared look and feel for Ken's web apps: design tokens, one stylesheet and
React 19 components, released as an npm tarball that each app pins.

- **[STYLEGUIDE.md](STYLEGUIDE.md)**: the rules, how an app installs it, the
  tokens, and every component with its props.
- **[PLAN.md](PLAN.md)**: the decisions (D-1 …). **[TODO.md](TODO.md)**: open work.
- **Kitchen sink**: `npm run dev`, then <http://localhost:5673>. Every
  component in every variant, light and dark side by side.

```bash
npm install
npm test          # components, tokens, house-ui-check
npm run lint
npm run build     # dist/
npm run watch     # rebuild dist/ on change, for an app using `npm link`
./release.sh 1.0.0
```

An app installs a release by its URL:

```bash
npm install https://github.com/kenjabber/house-ui/releases/download/v1.6.0/house-ui-1.6.0.tgz
```
