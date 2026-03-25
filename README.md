# 🧠 Elaia QA Portfolio — Mental Health & Wellness PWA

> **End-to-end QA portfolio demonstrating testing strategies for a real-world AI-powered mental health PWA.**  
> Covers 31 user stories across 9 epics — from static testing and test planning to full Playwright automation, LLM quality validation, security testing, and documented bug reports.

---

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=flat&logo=google&logoColor=white)
![Langfuse](https://img.shields.io/badge/Langfuse-000000?style=flat&logoColor=white)
![ISTQB](https://img.shields.io/badge/ISTQB-Principles-blue?style=flat)
![Automated](https://img.shields.io/badge/Automated-20%20scenarios-informational?style=flat)
[![Playwright Tests](https://github.com/TrogettoG/Elaia-qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/TrogettoG/Elaia-qa-portfolio/actions/workflows/playwright.yml)
![Defects](https://img.shields.io/badge/Defects-6%20found-red?style=flat)

---

## 📌 Project Context

**Elaia** is a mental health and emotional wellness PWA built with the following stack:

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite 6 |
| Auth | Firebase Auth (Email/Password + Google OAuth) |
| Local Storage | AES-256 via `crypto-js` (secureStorage) |
| AI / Chat | Gemini API (Google) — black box |
| Rate Limiting | Upstash Redis |
| Observability | Langfuse (LLM tracing) |
| Deploy | Vercel |
| Offline | Service Worker (PWA, cache-first) |

**User plans:** FREE and PRO — with differences in memory cards, chat summaries, history retention and Langfuse privacy level.

**Live app (public preview — may change over time):** [https://v0-elaia.vercel.app](https://v0-elaia.vercel.app)

---

## 🎯 Portfolio Scope

| Discipline | Coverage |
|---|---|
| **Static Testing** | 56 findings across user stories, system prompt, validations and routes |
| **Test Planning** | Full test plan v1.1 — strategy, levels, entry/exit criteria, risk matrix |
| **Functional Testing** | Happy path, edge cases, negative flows, BVA, equivalence partitioning |
| **Automation** | 20 strategic scenarios automated with Playwright + TypeScript + POM |
| **API Testing** | Payload inspection, 429 rate limit handling, contract validation |
| **LLM / AI Quality** | Memory cards, context pack validation, summary threshold, encryption |
| **Security Testing** | AES encryption, UID namespace isolation, no PII exfiltration over network |
| **Offline / PWA** | `context.setOffline()`, cache-first validation, no-sync behavior |
| **Bug Reporting** | 6 real defects found and documented with severity and full traceability |

---

## 🗂️ Repository Structure

```
elaia-qa-portfolio/
│
├── README.md
│
├── static-tests/
│   ├── hallazgos_revision_estatica.md   ← 56 static testing findings
│   └── refinamiento_HU.md              ← User story refinements per finding
│
├── user-stories/
│   ├── Elaia_User_Stories_v1_1.md      ← 31 US with acceptance criteria (v1.1)
│   └── Elaia_User_Stories_v1_1.pdf
│
├── test-plan/
│   └── Test_Plan_Elaia_v1_1.md         ← Full test plan v1.1
│
├── test-cases/
│   ├── Test_Cases_Strategic_20.md      ← 20 strategic TCs with rationale
│   └── Elaia_TestCases_v1.1.xlsx       ← Full backlog — 61 test cases
│
├── results/
│   └── bug-report.md                   ← 6 defects found during automation run
│
├── tests/                              ← Playwright test suite
│   ├── auth/                           ← TC-001, 003, 005, 006, 010, 026
│   ├── journal/                        ← TC-019, 020, 021, 022
│   ├── chat/                           ← TC-023, 024, 025, 029, 030
│   ├── relax/                          ← TC-036, 037 (manual — documented)
│   └── security/                       ← TC-056, 057, 058
│
├── pages/                              ← Page Object Models (POM)
│   ├── AuthPage.ts
│   ├── HomePage.ts
│   ├── JournalPage.ts
│   ├── ChatPage.ts
│   └── RelaxPage.ts
│
├── fixtures/
│   └── auth.fixture.ts                 ← loggedInPage + base fixtures
│
├── data/
│   └── test-data.ts                    ← Centralized test inputs via .env
│
└── playwright.config.ts
```

---

## 🤖 Automation Suite

**20 automated scenarios · 6 defects identified**

### Test distribution by epic

| Epic | TCs | Automated | Manual | Skip |
|---|---|---|---|---|
| EP1 — Auth | TC-001, 003, 005, 006, 010, 026 | 5 | 1 | — |
| EP3 — Journal | TC-019, 020, 021, 022 | 3 | — | 1 |
| EP4 — Chat + LLM | TC-023, 024, 025, 029, 030 | 5 | — | — |
| EP5 — Relax | TC-036, 037 | — | — | 2 |
| Security | TC-056, 057, 058 | 3 | — | — |

### Architecture

- **Page Object Model (POM)** — selectors isolated from test logic
- **Centralized test data** — no hardcoded values in spec files, credentials via `.env`
- **MSW-style mocking** via `page.route()` for 429, token errors
- **`page.evaluate()`** for localStorage inspection and encryption validation
- **`context.setOffline()`** for offline-first testing
- **Network interception** for payload inspection and exfiltration testing

### Key automation techniques demonstrated

- Network interception for rate limit validation
- LocalStorage inspection for encryption testing
- Offline simulation via `context.setOffline()`
- Multi-user session isolation testing
- LLM payload validation via request inspection

---

## 🔬 Example Tests

### TC-056 — AES encryption validation

```typescript
test('Las claves elaia_ tienen valores con formato CryptoJS (U2FsdGVkX1)', async ({
  loggedInPage,
  page,
}) => {
  const journalPage = new JournalPage(page);
  await journalPage.createEntry(JOURNAL.entryText, JOURNAL.mood);
  await page.waitForTimeout(1000);

  const elaiaKeys = await page.evaluate(() =>
    Object.entries(localStorage)
      .filter(([key]) => key.startsWith('elaia_'))
      .map(([key, value]) => ({ key, value }))
  );

  expect(elaiaKeys.length).toBeGreaterThan(0);

  elaiaKeys.forEach(({ value }) => {
    // AES-encrypted values always start with CryptoJS Salted__ signature
    expect(value).toMatch(/^U2FsdGVkX1/);
  });
});
```

### TC-029 — LLM payload validation (FREE user has no memory cards)

```typescript
test('el payload enviado al LLM no contiene memory cards para usuario FREE', async ({
  loggedInPage,
  page,
}) => {
  const chatPage = new ChatPage(page);
  let capturedPayload: any = null;

  await page.route('**/api/chat/**', async (route) => {
    capturedPayload = await route.request().postDataJSON();
    await route.continue();
  });

  await chatPage.gotoChat();
  await chatPage.sendMessage(CHAT.message);
  await page.waitForTimeout(2000);

  expect(capturedPayload).not.toBeNull();

  // FREE users must not receive memory card injection in contextPack
  const memoryCards = capturedPayload?.memoryCards ?? [];
  expect(memoryCards).toHaveLength(0);
});
```

---

## 🐛 Defects Found

| ID | TC | Severity | Description |
|---|---|---|---|
| BR-001 | TC-003 | Medium | Password policy not enforced — app accepts passwords without uppercase, number or special char |
| BR-002 | TC-006 | Medium | Login does not differentiate between non-existent email and wrong password — generic error shown |
| BR-003 | TC-010 | High | UI state not cleared after logout — welcome heading remains visible |
| BR-004 | TC-019 | Low | `elaia_latestEntry` key not present in localStorage — specified in US-009 but not implemented |
| BR-005 | TC-020 | Medium | Journal entry editing not implemented — edit button does not exist in timeline |
| BR-006 | TC-025 | Medium | Rate limit does not differentiate `user_rate_limit` from `ip_rate_limit` — both return same error message |

Full details: [`results/bug-report.md`](results/bug-report.md)

---

## 📐 Test Design Techniques

| Technique | Applied in |
|---|---|
| Boundary Value Analysis (BVA) | TC-003 — password length (7 chars rejected, 8 accepted) |
| Equivalence Partitioning | TC-003 — invalid classes (no uppercase, no number, no special) |
| State Transition | TC-005 — session persistence with/without Remember Me |
| Payload Inspection | TC-029 — FREE user contextPack has no memory cards |
| Offline-first validation | TC-022 — journal works without network, no sync on reconnect |
| Encryption validation | TC-056 — AES CryptoJS (U2FsdGVkX1 prefix) |
| Multi-user isolation | TC-057 — firebaseUid namespace separation |
| Network exfiltration check | TC-058 — no POST/PUT requests when browsing journal |

---

## 📋 Naming & Traceability Conventions

Following ISTQB traceability principles:

- **File naming:** `TC-XXX-kebab-description.spec.ts`
- **Describe block:** `TC-XXX | Exact title from test case document`
- **Bug prefix:** `[BUG BR-XXX]` in test name — visible in HTML report
- **Skip rationale:** documented inline with `test.skip()` — design decision or manual execution reason
- **All TCs reference:** User Story (US-XXX) + static finding (HAL-XXX) where applicable

---

## ⚙️ Running the Suite

```bash
# Install dependencies
npm install
npx playwright install chromium

# Copy environment variables
cp .env.example .env
# Edit .env with QA account credentials

# Run full suite
npx playwright test

# Run specific epic
npx playwright test tests/auth/
npx playwright test tests/security/

# Open HTML report
npx playwright show-report results/html-report
```

**Requirements:** Node.js 18+ · QA accounts in Firebase (see `.env.example`)

---

## 📅 Versions

| Field | Value |
|---|---|
| App under test | Elaia v1.0 |
| QA documentation | v1.1 |
| Date | March 2026 |
| Status | 🟢 Complete |

---

*QA Engineer: Gian (Gianfranco Trogetto) · Rosario, Argentina*  
*Specialization: AI Quality Testing · Playwright · LLM Evaluation · Langfuse*