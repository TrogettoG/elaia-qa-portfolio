# 🧠 Elaia QA Portfolio — Mental Health & Wellness App

> **Proyecto de QA completo sobre una PWA real de salud mental.**  
> Este repositorio documenta el proceso de aseguramiento de calidad de Elaia v1.0, cubriendo las 31 historias de usuario distribuidas en 9 épicas — desde pruebas funcionales hasta validación de comportamiento de IA, seguridad y rendimiento offline.

---

## 📋 Contexto del Proyecto

**Elaia** es una PWA (*Progressive Web App*) de salud mental y bienestar emocional construida con:

| Capa | Tecnología |
|---|---|
| Frontend | React + TypeScript + Vite 6 |
| Autenticación | Firebase Auth (Email/Password + Google OAuth) |
| Storage local | AES-256 via `crypto-js` (secureStorage) |
| IA / Chat | API Gemini (Google) — caja negra |
| Rate Limiting | Upstash Redis (Ratelimit middleware) |
| Observabilidad | Langfuse (tracing LLM) |
| Deploy | Vercel (CI/CD via GitHub Actions) |
| Offline | Service Worker (PWA, cache-first strategy) |

**Planes de usuario:** FREE y PRO — con diferencias en memory cards, summaries, historial de chat y nivel de privacidad en Langfuse.

---

## 🎯 Objetivo del Portfolio

Demostrar habilidades de QA aplicadas sobre un sistema real con múltiples capas de complejidad:

- ✅ Diseño de casos de prueba derivados directamente de User Stories (Gherkin / BDD-style)
- ✅ Testing funcional con cobertura de happy path, edge cases y flujos negativos
- ✅ Security testing: CSP headers, rate limiting, no-exfiltración de PII
- ✅ AI/LLM quality testing: validación semántica, memory cards, Jaccard deduplication, summaries
- ✅ Offline / PWA testing: Service Worker, cache-first, reconexión automática
- ✅ Performance testing: storage lleno, payloads límite, latencia de API
- ✅ Static testing: revisión de prompt del sistema, validaciones Zod, CSP policy
- ✅ Gestión de defectos con severidad y prioridad definida
- ✅ Plantillas de resultados / evidencia lista para ejecutar

---

## 🗂️ Estructura del Repositorio

```
elaia-qa-portfolio/
│
├── README.md                        ← Este archivo
│
├── user-stories/
│   └── Elaia_User_Stories_v1_0.md  ← 31 US con criterios de aceptación
│
├── test-plan/
│   └── Test_Plan_Elaia_v1.md       ← Plan completo: estrategia, niveles, criterios
│
├── test-cases/
│   ├── TC_EP01_Autenticacion.md    ← Épica 1: Firebase Auth (US-001 a US-004)
│   ├── TC_EP02_Home_MoodTracker.md ← Épica 2: Home & Mood (US-005 a US-007)
│   ├── TC_EP03_Journal.md          ← Épica 3: Journal AES (US-008 a US-011)
│   ├── TC_EP04_Chat_IA.md          ← Épica 4: Chat + Gemini (US-012 a US-017)
│   ├── TC_EP05_Relax_Panic.md      ← Épica 5: Breathing + Panic (US-018 a US-020)
│   ├── TC_EP06_Insights.md         ← Épica 6: Métricas (US-021 a US-023)
│   ├── TC_EP07_Support.md          ← Épica 7: Contactos (US-024 a US-026)
│   ├── TC_EP08_Perfil.md           ← Épica 8: Perfil + i18n (US-027 a US-029)
│   └── TC_EP09_PWA.md              ← Épica 9: PWA + Offline (US-030 a US-031)
│
├── static-tests/
│   ├── ST_01_System_Prompt_Review.md   ← Revisión estática del prompt de Elaia
│   ├── ST_02_CSP_Headers_Review.md     ← Análisis de Content Security Policy
│   └── ST_03_Zod_Validations_Review.md ← Revisión de esquemas de validación
│
└── results/
    ├── TEMPLATE_Execution_Report.md    ← Plantilla de reporte de ejecución
    ├── TEMPLATE_Bug_Report.md          ← Plantilla de reporte de defecto
    └── TEMPLATE_Test_Session_Notes.md  ← Notas de sesión exploratoria
```

---

## 🧪 Tipos de Prueba Incluidos

| Tipo | Descripción | Herramienta / Enfoque |
|---|---|---|
| **Funcional** | Happy path + edge cases + flujos negativos por US | Manual / Playwright E2E |
| **Seguridad** | CSP headers, rate limiting 429, no-leak PII, AES | Manual + DevTools |
| **IA / LLM** | Prompt injection, memory cards, Jaccard, summaries | Manual + Langfuse |
| **Offline / PWA** | Service Worker, cache-first, reconexión | DevTools → Network tab |
| **Performance** | Storage lleno, 200/5000 msgs, latencia API | Manual + throttling |
| **Estático** | Prompt review, CSP policy, validaciones Zod | Revisión de código |
| **Exploratorio** | Sesiones libres por épica crítica | Testing tours |

---

## ⚙️ Épicas y Cobertura

| # | Épica | US | Criticidad |
|---|---|---|---|
| 1 | Autenticación y Sesión | US-001 a US-004 | 🔴 Alta |
| 2 | Home & Mood Tracker | US-005 a US-007 | 🟡 Media |
| 3 | Journal Emocional (AES) | US-008 a US-011 | 🔴 Alta |
| 4 | Chat con Elaia — Core + IA | US-012 a US-017 | 🔴 Alta |
| 5 | Relax — Breathing & Panic | US-018 a US-020 | 🔴 Alta |
| 6 | Insights y Métricas | US-021 a US-023 | 🟡 Media |
| 7 | Support — Contactos Emergencia | US-024 a US-026 | 🔴 Alta |
| 8 | Perfil y Configuración | US-027 a US-029 | 🟡 Media |
| 9 | PWA & Instalación | US-030 a US-031 | 🔴 Alta |

---

## 🚦 Criterios de Severidad de Defectos

| Severidad | Descripción | Impacto |
|---|---|---|
| **P1 — Crítico** | Bloquea flujo core o expone datos sensibles | Bloquea release |
| **P2 — Alto** | Funcionalidad principal degradada sin workaround | Bloquea PR |
| **P3 — Medio** | Funcionalidad secundaria degradada, existe workaround | Sprint backlog |
| **P4 — Bajo** | UX/cosmético, no afecta funcionalidad | Backlog futuro |

---

## 👤 Autor

**Gian** — QA Automation Engineer  
Especialización en AI Quality Testing · Playwright (TypeScript) · LLM Evaluation · Langfuse  
📍 Rosario, Argentina · [DevAI.solutions](https://devai.solutions)

---

## 📅 Versión

| Campo | Valor |
|---|---|
| Versión app bajo prueba | Elaia v1.0 |
| Versión documentación QA | v1.0 |
| Fecha | Marzo 2026 |
| Estado | 🟢 En progreso |
