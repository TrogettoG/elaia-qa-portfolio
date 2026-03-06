import { test, expect } from '../../fixtures/auth.fixture';
import { TEXTS, TIMEOUTS } from '../../data/test-data';

/**
 * TC-001: Registro exitoso de nuevo usuario
 * Épica: Autenticación
 * Prioridad: Alta
 *
 * Precondición: Email no registrado previamente (se genera con timestamp único).
 * Backend: Firebase Authentication
 *
 * Notas de diseño:
 * - La app es SPA: la URL permanece en '/' antes y después del registro.
 * - No existe campo "nombre" en el formulario — solo email, contraseña y confirmar.
 * - El cambio login/registro se hace con tabs, no con navegación de ruta.
 */
test.describe('TC-001 | Registro exitoso', () => {
  test('Un usuario nuevo puede registrarse con datos válidos y accede al home', async ({
    authPage,
    homePage,
  }) => {
    const email    = `qa.elaia+${Date.now()}@mailinator.com`;
    const password = 'Test@1234!';

    // 1. Ir a la pantalla de registro (tab "Registrarse")
    await authPage.gotoRegister();

    // 2. Completar el formulario de registro
    await authPage.register(email, password);

    // 3. Verificar que el dashboard carga (URL se mantiene en '/')
    await expect(homePage.welcomeHeading).toBeVisible({ timeout: TIMEOUTS.long });

    // 4. Verificar el contenido del heading de bienvenida
    await expect(homePage.welcomeHeading).toContainText(TEXTS.welcomeHeading);
  });
});
