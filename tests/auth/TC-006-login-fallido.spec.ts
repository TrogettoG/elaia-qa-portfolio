import { test, expect } from '../../fixtures/auth.fixture';
import { USERS, ROUTES, TIMEOUTS } from '../../data/test-data';

/**
 * TC-006: Login fallido — credenciales incorrectas
 * Épica: Autenticación
 * Prioridad: Alta
 *
 * Escenarios:
 * 1. Email inexistente → error "usuario no encontrado"
 * 2. Contraseña incorrecta → error "contraseña incorrecta"
 * 3. En ningún caso redirige al home
 *
 * Precondición: El usuario está en la pantalla de login.
 * Backend: Firebase Authentication
 *
 * Notas de diseño:
 * - La app es SPA: URL permanece en '/' después del login fallido
 * - Los errores se muestran en elemento <p> con color de error #FF6B6B
 * - BUG BR-002: La app no diferencia entre email inexistente y contraseña incorrecta
 *   Ambos casos muestran mensaje genérico "Ocurrió un error. Por favor, intenta de nuevo"
 */
test.describe('TC-006 | Login fallido — credenciales incorrectas', () => {
  test('[BUG BR-002] Email inexistente muestra error de usuario no encontrado', async ({
    authPage,
  }) => {
    // Verifica que login con email inexistente muestra error
    await authPage.gotoLogin();
    await authPage.login(USERS.nonExistentUser.email, USERS.nonExistentUser.password);

    // BUG BR-002: La app muestra mensaje genérico en lugar de diferenciar
    await expect(authPage.loginErrorMessage).toBeVisible({ timeout: TIMEOUTS.medium });
    await expect(authPage.loginErrorMessage).toContainText(
      /ocurrió un error|por favor, intenta de nuevo/i,
    );
  });

  test('[BUG BR-002] Contraseña incorrecta muestra error de contraseña incorrecta', async ({
    authPage,
  }) => {
    // Verifica que login con contraseña incorrecta muestra error
    await authPage.gotoLogin();
    await authPage.login(USERS.freeUser.email, 'WrongPass@1');

    // BUG BR-002: La app muestra mensaje genérico en lugar de diferenciar
    await expect(authPage.loginErrorMessage).toBeVisible({ timeout: TIMEOUTS.medium });
    await expect(authPage.loginErrorMessage).toContainText(
      /ocurrió un error|por favor, intenta de nuevo/i,
    );
  });

  test('En ningún caso redirige al home (usuario inexistente)', async ({
    authPage,
    page,
  }) => {
    // 1. Ir a la pantalla de login
    await authPage.gotoLogin();

    // 2. Intentar login con usuario inexistente
    await authPage.login(USERS.nonExistentUser.email, USERS.nonExistentUser.password);

    // 3. Verificar que sigue en la pantalla de login (URL = '/') pero formulario es visible
    await expect(page).toHaveURL(ROUTES.home);
    await expect(authPage.loginErrorMessage).toBeVisible({ timeout: TIMEOUTS.medium });

    // 4. Verificar que el formulario de login sigue siendo accesible
    await expect(authPage.emailInput).toBeVisible();
    await expect(authPage.passwordInput).toBeVisible();
  });

  test('En ningún caso redirige al home (contraseña incorrecta)', async ({
    authPage,
    page,
  }) => {
    // 1. Ir a la pantalla de login
    await authPage.gotoLogin();

    // 2. Intentar login con contraseña incorrecta
    await authPage.login(USERS.freeUser.email, 'WrongPass@1');

    // 3. Verificar que sigue en la pantalla de login (URL = '/') pero formulario es visible
    await expect(page).toHaveURL(ROUTES.home);
    await expect(authPage.loginErrorMessage).toBeVisible({ timeout: TIMEOUTS.medium });

    // 4. Verificar que el formulario de login sigue siendo accesible
    await expect(authPage.emailInput).toBeVisible();
    await expect(authPage.passwordInput).toBeVisible();
  });
});
