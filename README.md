![E2E Tests](https://github.com/Roman177-png/playwright-saucedemo-restful-booker/actions/workflows/ci.yml/badge.svg)

# SauceDemo + Restful Booker E2E Suite

End-to-end test automation portfolio project built with Playwright and TypeScript. It covers a UI
flow (SauceDemo) and a REST API (Restful Booker) using the same engineering standards you'd expect
in a production test suite: Page Object Model, custom fixtures, typed API clients, and CI with
sharded parallel execution.

## Scope

**UI — https://www.saucedemo.com**

- Login: valid credentials, data-driven negative cases (bad password, unknown user, empty fields,
  locked-out account)
- Product sorting: name A-Z/Z-A, price low-high/high-low
- Cart: add/remove items, badge count correctness
- Checkout: full end-to-end purchase, required-field validation

**API — https://restful-booker.herokuapp.com**

- Booking CRUD: create, read, full update (PUT), partial update (PATCH), delete
- Authorization: token issuance, rejection of writes without a valid token
- Negative paths: non-existent resources, empty filtered search results, double delete

## Architecture

```
src/
  pages/        Page Object Model classes, one per screen (LoginPage, InventoryPage, ...)
  components/   Shared UI fragments used across pages (HeaderComponent, CartBadgeComponent)
  api/          Typed API client + request/response models (no raw fetch/axios calls in tests)
  fixtures/     Playwright custom fixtures wiring page objects and API clients into tests
  data/         Test data builders and static fixtures (users, booking builder) - no magic values
tests/
  ui/           SauceDemo specs, plus the storageState auth.setup.ts
  api/          Restful Booker specs
```

### Why these decisions

- **Page Object Model with shared components.** Locators and screen interactions live in one
  place per page; the header/cart badge are extracted into `components/` because they appear on
  multiple pages and would otherwise be duplicated or drift out of sync.
- **Custom fixtures instead of constructing page objects in every test.** `src/fixtures/ui.fixtures.ts`
  injects ready-to-use page objects; `src/fixtures/api.fixtures.ts` injects an authenticated API
  client. Tests read as business scenarios, not wiring code.
- **storageState instead of logging in through the UI per test.** A dedicated `setup` project
  (`tests/ui/auth.setup.ts`) logs in once and persists the session to
  `playwright/.auth/standard-user.json`. Every UI test project depends on `setup` and reuses that
  state, cutting redundant UI interactions that have nothing to do with what's under test. Tests
  that specifically need an unauthenticated session (login spec) override it locally with
  `test.use({ storageState: ... })`.
- **A typed API layer separate from UI tests.** `BookingApiClient` returns typed results
  (`Booking`, `CreateBookingResponse`) built from interfaces in `src/api/models`, so a schema
  change is a compile error, not a runtime surprise.
- **Builders over literals.** `BookingBuilder` produces valid payloads with sane defaults; tests
  override only the fields relevant to what they're asserting.

## Getting started

```bash
npm install
npx playwright install --with-deps
cp .env.example .env
```

## Running tests

```bash
npm test                 # everything: setup, UI (chromium/firefox/webkit), API
npm run test:ui          # UI projects only
npm run test:api         # API project only
npm run test:smoke       # @smoke-tagged tests across all projects
npm run test:regression  # @regression-tagged tests across all projects
npm run report           # open the last HTML report
```

## Quality gates

```bash
npm run lint       # ESLint
npm run format     # Prettier (write)
npm run typecheck   # tsc --noEmit
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request to `main`:

1. **lint** - Prettier check, ESLint, TypeScript typecheck
2. **test** - Playwright tests sharded across 2 jobs, with trace/screenshot/video capture on
   failure uploaded as artifacts
3. **merge-report** - merges the sharded blob reports into a single HTML report, published as a
   build artifact

Sample report locations after a local run:

- `playwright-report/index.html` - interactive HTML report
- `test-results/` - traces, screenshots, and videos for failed tests
