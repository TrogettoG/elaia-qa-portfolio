import { test, expect } from '../../fixtures/auth.fixture';
import { USERS, TEXTS, TIMEOUTS } from '../../data/test-data';

/**
 * TC-005: Login exitoso — persistencia de sesión con y sin Recordarme
 * Épica: Autenticación
 * Prioridad: Alta
 *
 * Requisito: El toggle "Recordar mi sesión" debe cambiar el modo de persistencia
 * de Firebase Auth entre browserLocalPersistence y browserSessionPersistence.
 *
 * Comportamiento esperado:
 *   - Toggle ON  → token en localStorage  (browserLocalPersistence)
 *   - Toggle OFF → token en sessionStorage (browserSessionPersistence)
 *
 * Precondición: USERS.freeUser debe existir como cuenta activa en Firebase.
 */

test.describe('TC-005 | Login exitoso — persistencia de sesión con y sin Recordarme', () => {

  test('inicia sesión correctamente y redirige al home', async ({ authPage, homePage }) => {
    await authPage.gotoLogin();
    await authPage.login(USERS.freeUser.email, USERS.freeUser.password);

    await expect(homePage.welcomeHeading).toBeVisible({ timeout: TIMEOUTS.long });
    await expect(homePage.welcomeHeading).toContainText(TEXTS.welcomeHeading);
  });

  test('con Recordarme activo la sesión persiste en localStorage (browserLocalPersistence)', async ({
    page,
    authPage,
    homePage,
  }) => {
    await authPage.gotoLogin();
    // Toggle está ON por defecto — no se hace click

    await authPage.login(USERS.freeUser.email, USERS.freeUser.password);
    await expect(homePage.welcomeHeading).toBeVisible({ timeout: TIMEOUTS.long });

    const localHasToken   = await page.evaluate(() =>
      Object.keys(localStorage).some(k => k.startsWith('firebase:authUser:'))
    );
    const sessionHasToken = await page.evaluate(() =>
      Object.keys(sessionStorage).some(k => k.startsWith('firebase:authUser:'))
    );

    expect(localHasToken,   'token debe estar en localStorage').toBe(true);
    expect(sessionHasToken, 'token NO debe estar en sessionStorage').toBe(false);
  });

  test('sin Recordarme activo la sesión usa sessionStorage (browserSessionPersistence)', async ({
    page,
    authPage,
    homePage,
  }) => {
    await authPage.gotoLogin();
    await authPage.rememberMeToggle.click(); // desactiva el toggle

    await authPage.login(USERS.freeUser.email, USERS.freeUser.password);
    await expect(homePage.welcomeHeading).toBeVisible({ timeout: TIMEOUTS.long });

    const localHasToken   = await page.evaluate(() =>
      Object.keys(localStorage).some(k => k.startsWith('firebase:authUser:'))
    );
    const sessionHasToken = await page.evaluate(() =>
      Object.keys(sessionStorage).some(k => k.startsWith('firebase:authUser:'))
    );

    expect(sessionHasToken, 'token debe estar en sessionStorage').toBe(true);
    expect(localHasToken,   'token NO debe estar en localStorage').toBe(false);
  });
});
