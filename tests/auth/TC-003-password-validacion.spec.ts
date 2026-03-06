import { test, expect } from '../../fixtures/auth.fixture';
import { TEXTS, TIMEOUTS } from '../../data/test-data';

/**
 * TC-003: Validación de política de contraseña
 * Épica: Autenticación
 * Prioridad: Alta
 *
 * Precondición: Validación de contraseña según HAL-001
 * Backend: Firebase Authentication
 *
 * Requisito (HAL-001 / Test Plan v1.1 §10):
 *   Contraseña válida = mínimo 8 caracteres + 1 mayúscula + 1 número + 1 especial
 *
 * Estado actual de la implementación (explorado con MCP 2026-03-04):
 *   - Firebase solo valida mínimo 6 chars (silencioso, sin mensaje de error)
 *   - No existe validación client-side de mayúscula, número ni especial
 *   - Los casos marcados con test.fail() documentan el BUG HAL-001:
 *     la política especificada NO está implementada en la app
 *
 * Particiones de equivalencia (campo contraseña):
 * ┌────────────────────────────┬───────────┬──────────────────────────┐
 * │ Clase                      │ Válida    │ Representante            │
 * ├────────────────────────────┼───────────┼──────────────────────────┤
 * │ Longitud < 8               │ NO        │ "Abcdef1" (7 chars)      │
 * │ Longitud >= 8, compleja    │ SÍ        │ "Abcdef1!" (8 chars)     │
 * │ Sin mayúscula              │ NO        │ "abcdef1!" (8 chars)     │
 * │ Sin número                 │ NO        │ "Abcdefg!" (8 chars)     │
 * │ Sin especial               │ NO        │ "Abcdef12" (8 chars)     │
 * └────────────────────────────┴───────────┴──────────────────────────┘
 *
 * AVL — frontera de longitud:
 *   min - 1 → 7 chars (rechazado)
 *   min     → 8 chars (aceptado, si cumple el resto de reglas)
 */

const EMAIL = () => `qa.tc003+${Date.now()}@mailinator.com`;

// ---------------------------------------------------------------------------
// Partición INVÁLIDA — la app DEBERÍA rechazar estos casos.
// test.fail() indica que el test actualmente falla porque la app los acepta.
// Cuando HAL-001 esté corregido, quitar test.fail() y el comentario de bug.
// ---------------------------------------------------------------------------
const rejectedCases = [
  {
    id:       'AVL-MIN-1',
    label:    'contraseña de 7 caracteres es rechazada por estar por debajo del mínimo de 8 (AVL: min−1)',
    password: 'Abcdef1',                // 7 chars, tiene mayúscula y número pero < 8
  },
  {
    id:       'PE-NO-UPPER',
    label:    'contraseña sin mayúscula es rechazada (partición inválida)',
    password: 'abcdef1!',               // 8 chars, número y especial, sin mayúscula
  },
  {
    id:       'PE-NO-NUMBER',
    label:    'contraseña sin número es rechazada (partición inválida)',
    password: 'Abcdefg!',               // 8 chars, mayúscula y especial, sin número
  },
  {
    id:       'PE-NO-SPECIAL',
    label:    'contraseña sin carácter especial es rechazada (partición inválida)',
    password: 'Abcdef12',               // 8 chars, mayúscula y número, sin especial
  },
] as const;

// ---------------------------------------------------------------------------
// Partición VÁLIDA — la app DEBE aceptar estos casos.
// ---------------------------------------------------------------------------
const acceptedCases = [
  {
    id:       'AVL-MIN',
    label:    'contraseña de 8 caracteres con mayúscula, número y especial es aceptada (AVL: min exacto)',
    password: 'Abcdef1!',               // 8 chars, mayúscula + número + especial ✓
  },
] as const;

// ---------------------------------------------------------------------------
// BUG BR-001: casos rechazados — actualmente la app los acepta (test.fail)
// ---------------------------------------------------------------------------
test.describe('TC-003 | Validación de política de contraseña (AVL + particiones)', () => {
  for (const { id, label, password } of rejectedCases) {
    test(`[BUG BR-001] ${label}`, async ({ authPage, homePage }) => {
      test.fail(
        true,
        `BUG BR-001: La app acepta "${password}" pero debería rechazarlo. Corregir cuando se implemente la política.`
      );
      await authPage.gotoRegister();
      await authPage.register(EMAIL(), password);

      // La app DEBERÍA mantener el formulario visible y NO autenticar al usuario.
      // Actualmente falla porque sí autentica → dashboard se muestra → test.fail lo captura.
      await expect(authPage.registerForm).toBeVisible({ timeout: TIMEOUTS.short });
      await expect(homePage.welcomeHeading).not.toBeVisible({ timeout: TIMEOUTS.short });
    });
  }
});

// ---------------------------------------------------------------------------
// Partición válida — debe pasar siempre
// ---------------------------------------------------------------------------
test.describe('TC-003 | Validación de política de contraseña (AVL + particiones) — partición válida', () => {
  for (const { id, label, password } of acceptedCases) {
    test(`[${id}] ${label}`, async ({ authPage, homePage }) => {
      await authPage.gotoRegister();
      await authPage.register(EMAIL(), password);

      await expect(homePage.welcomeHeading).toBeVisible({ timeout: TIMEOUTS.long });
      await expect(homePage.welcomeHeading).toContainText(TEXTS.welcomeHeading);
    });
  }
});
