## ING Hubs – Employee Management (Lit)

Employee management app built with Web Components (Lit). Features list, search/filter, create/edit, delete, table and card views, i18n, and pagination.

### Requirements
- Node.js 18+ and npm

### Install
```bash
npm i
```

### Develop
```bash
npm run serve
```
Open the URL printed by the dev server.

### Build
```bash
npm run build
```

### Test & Coverage
```bash
npm test            # runs dev + prod tests with coverage
npm run test:watch  # watch mode
```
Git pre-push runs tests and fails the push if line coverage < 85%.
Threshold can be adjusted in `package.json` script `prepush:checks`.

### Lint & Format
```bash
npm run lint
npm run format
```

### Path Aliases
Use `@` to import from `src`, e.g. `import x from '@/utils/date.js'`.

### Scripts
- `serve`, `serve:prod`
- `build`
- `test`, `test:watch`
- `lint`, `format`

### Project Structure
- `src/` components, pages, utils, i18n
- `assets/` static files
- `dist/` production bundle

