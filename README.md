# 🧠 Elaia QA Portfolio — Mental Health & Wellness PWA

> **End-to-end QA portfolio on a real-world mental health PWA.**  
> Covers 31 user stories across 9 epics — from static testing and test planning to full Playwright automation, LLM quality validation, security testing, and documented bug reports.

---

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=flat&logo=google&logoColor=white)
![Langfuse](https://img.shields.io/badge/Langfuse-000000?style=flat&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![ISTQB](https://img.shields.io/badge/ISTQB-Principles-blue?style=flat)
![Tests](https://img.shields.io/badge/Tests-52%20total-informational?style=flat)
![Passed](https://img.shields.io/badge/Passed-45-brightgreen?style=flat)
![Failed](https://img.shields.io/badge/Failed-6%20bugs-red?style=flat)
![Skipped](https://img.shields.io/badge/Skipped-3-lightgrey?style=flat)

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

**Live app:** [https://v0-elaia.vercel.app](https://v0-elaia.vercel.app)

---

## 🎯 Portfolio Scope

| Discipline | Coverage |
|---|---|
| **Static Testing** | 56 findings across user stories, system prompt, validations and routes |
| **Test Planning** | Full test plan v1.1 — strategy, levels, entry/exit criteria, risk matrix |
| **Functional Testing** | Happy path, edge cases, negative flows, BVA, equivalence partitioning |
| **Automation** | 20 strategic TCs automated with Playwright + TypeScript + POM |
| **API Testing** | Payload inspection, 429 rate limit handling, contract validation |
| **LLM / AI Quality** | Memory cards, context pack validation, summary threshold, encryption |
| **Security Testing** | AES encryption, UID namespace isolation, no PII exfiltration over network |
| **Offline / PWA** | `context.setOffline()`, cache-first validation, no-sync behavior |
| **Bug Reporting** | 6 real bugs found and documented with severity and full traceability |

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
│   └── bug_report.md                   ← 6 bugs found during automation run
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
│   └── test-data.ts                    ← Centralized credentials and test inputs
│
└── playwright.config.ts
```

---

## 🤖 Automation Suite — Results

| Metric | Value |
|---|---|
| Total tests | 52 |
| ✅ Passed | 45 |
| ❌ Failed (bugs) | 6 |
| ⏭️ Skipped | 3 |
| Execution time | ~1.5 min |
| Browser | Chromium |
| Base URL | https://v0-elaia.vercel.app |

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
- **Centralized test data** — no hardcoded values in spec files
- **MSW-style mocking** via `page.route()` for 429, token errors
- **`page.evaluate()`** for localStorage inspection and encryption validation
- **`context.setOffline()`** for offline-first testing
- **Network interception** for payload inspection and exfiltration testing

---

## 🐛 Bugs Found

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

# Run full suite
npx playwright test

# Run specific epic
npx playwright test tests/auth/
npx playwright test tests/security/

# Open HTML report
npx playwright show-report results/html-report
```

**Requirements:** Node.js 18+ · Active QA accounts in Firebase (provided separately)

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