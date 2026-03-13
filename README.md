# Yoma Car Share — QA Automation Suite

**Assessment:** QA Manager | Blind Testing | March 2026  
**Tester:** James Huynh  
**Site:** [carshare.yomafleet.com](https://carshare.yomafleet.com)

---

## Why Playwright (not Nightwatch)

The assessment recommended Selenium/Nightwatch. Playwright was chosen instead:

- **Auto-wait by design** — eliminates a class of flaky tests without manual `waitFor` calls
- **Native TypeScript** — no additional config, full type safety on locators and assertions
- **Trace viewer + video** — faster root cause analysis on CI failures  
- **Multi-browser parallel** — Chromium and Firefox in one command
- **POM without boilerplate** — cleaner page abstraction than WebDriver wrappers

A QA lead should justify tool choices, not follow recommendations blindly.

---

## Architecture

```
pages/          Page Object Model — one class per page
tests/
  smoke/        @smoke — CI gate, must pass on every push
  search/       @regression — car finding flows
  guest/        @regression — unauthenticated user journey
  bugs/         @bugs — intentionally failing, document open defects
fixtures/       Test data — locations, dates, credentials
utils/          Shared helpers
.github/        CI/CD — GitHub Actions
```

---

## Quick Start

```bash
npm install
npx playwright install --with-deps chromium
cp .env.example .env   # fill in test credentials

npm run test:smoke     # fast gate — ~30s
npm run test           # full suite
npm run report         # open HTML report
```

---

## Test Tags

| Tag | Purpose | When |
|---|---|---|
| `@smoke` | Core sanity — homepage, form render | Every push |
| `@regression` | Full flow coverage | Main branch |
| `@bugs` | Documents open defects — expected to fail | Manual / on demand |

---

## Bugs Documented as Failing Tests

Failing tests in `tests/bugs/` are **intentional**. They serve as living bug reports:
when the bug is fixed, the test turns green automatically — no manual tracking needed.

| Test | Bug | Severity |
|---|---|---|
| `bug-005.spec.ts` | Sentry crash on rapid search | 🔴 Critical |
| `bug-012-013.spec.ts` | Membership gate not translated (lang=mm) | 🟡 Medium |
| `bug-012-013.spec.ts` | Duplicate notification — web + iOS App Store v2.9.5 | 🔴 Critical |

---

## Known Gaps

| Gap | Reason | Plan |
|---|---|---|
| Reservation E2E | Account under review — cannot book | Mock API in Sprint 2 |
| Mobile suite | iOS App Store v2.9.5 explored manually — BUG-013 confirmed cross-platform | Playwright mobile viewport Phase 2 |
| Language toggle full flow | Myanmar font rendering config needed for headless CI | Phase 2 |

---

## CI/CD

GitHub Actions runs smoke on every push, regression on main.  
Credentials stored as repository secrets — never in code.

---

*Assessment scope: 3-day blind test. No API docs. No pre-approved account.*  
*Full strategy and findings available for discussion.*
