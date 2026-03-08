# ELAIA — Bug Report
## Ejecución automatizada · Marzo 2026

**Suite:** 20 TCs estratégicos · 52 tests  
**Resultado:** 45 passed · 6 failed · 3 skipped  
**Herramienta:** Playwright + TypeScript  
**Ambiente:** Producción — https://v0-elaia.vercel.app/  
**Fecha:** Marzo 2026  

---

## Bugs encontrados

| ID | TC | Severidad | Descripción | US | HAL | Estado |
|---|---|---|---|---|---|---|
| BR-001 | TC-003 | Media | Política de contraseña no implementada — la app acepta passwords sin mayúscula, número ni carácter especial. Firebase solo valida mínimo 6 chars. | US-001 | HAL-001 | Abierto |
| BR-002 | TC-006 | Media | Login no diferencia entre email inexistente y contraseña incorrecta — ambos casos muestran "Ocurrió un error. Por favor, intenta de nuevo" | US-002 | HAL-005 | Abierto |
| BR-003 | TC-010 | Alta | Estado UI no se limpia tras logout — el welcomeHeading "Hola, Usuario" sigue visible después de cerrar sesión | US-004 | HAL-004 | Abierto |
| BR-004 | TC-019 | Baja | Clave `elaia_latestEntry` no existe en localStorage — especificada en US-009 pero no implementada en la app | US-009 | — | Abierto |
| BR-005 | TC-020 | Media | Funcionalidad de editar entradas de journal no implementada — botón de edición no existe en el timeline | US-010 | HAL-017 | Abierto |
| BR-006 | TC-025 | Media | Rate limit no diferencia `user_rate_limit` de `ip_rate_limit` — ambos retornan "Error de conexión" sin distinción para el usuario | US-013 | HAL-022 | Abierto |

---

## Decisiones de diseño documentadas

| TC | Decisión |
|---|---|
| TC-021 | Entradas de journal son inmutables por diseño — app de salud mental, el historial no debe poder eliminarse |

---

## Tests de ejecución manual

| TC | Título | Razón |
|---|---|---|
| TC-026 | Token Firebase expirado → redirect a login | Requiere revocar token manualmente en Firebase Console — no scripteable |
| TC-036 | Breathing completado → AppContextPack | Ejercicio dura 70s reales — requiere `VITE_BREATHING_CYCLE_MS` expuesto en producción |
| TC-037 | Breathing interrumpido → AppContextPack | Misma razón que TC-036 |

---

## Distribución de severidad

| Severidad | Cantidad |
|---|---|
| Alta | 1 (BR-003) |
| Media | 4 (BR-001, BR-002, BR-005, BR-006) |
| Baja | 1 (BR-004) |

---

## Observación de testabilidad

Durante la automatización se identificó una limitación estructural de la app que impacta directamente la mantenibilidad de la suite.

**Problema:** La app no expone atributos de identificación estables en elementos interactivos clave. Los componentes carecen de `data-testid`, `aria-label` o IDs semánticos en botones de acción, selectores de mood, controles de navegación y otros elementos críticos para el testing.

**Impacto en automatización:** Los selectores deben basarse en posición DOM (`nth()`), clases CSS utilitarias de Tailwind, o estructura interna de SVG — todos sensibles a cambios de UI no relacionados con la funcionalidad bajo prueba. Esto incrementa el costo de mantenimiento de la suite ante cualquier refactor visual.

**Recomendación:** Agregar atributos de testabilidad durante el desarrollo:

```html
<!-- Ejemplos -->
<button data-testid="send-message-btn">...</button>
<button data-testid="mood-btn-1">...</button>
<button data-testid="logout-btn">...</button>
<input data-testid="journal-entry-textarea" />
```

Esta práctica es especialmente relevante en proyectos con desarrollo asistido por IA, donde la estructura del DOM puede cambiar significativamente entre iteraciones sin que el comportamiento funcional se vea afectado.

---

*Bug Report — ELAIA v1.1 · QA Engineer: Gian · Marzo 2026*  
*Trazabilidad completa: `test-cases/Test_Cases_Strategic_20.md`*