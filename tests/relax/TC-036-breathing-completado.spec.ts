import { test } from '../../fixtures/auth.fixture';

test.describe('TC-036 | Breathing Exercise — sesión completada en AppContextPack', () => {
  /**
   * TC-036: Breathing Exercise — sesión completada en AppContextPack
   * Épica: Relax
   * Prioridad: Media
   *
   * Precondición: Usuario autenticado con fixture loggedInPage
   * Backend: Firebase Firestore + AppContextPack
   *
   * Notas de diseño:
   * - Duración: 70 segundos reales (5 ciclos × 14 segundos)
   * - EJECUCIÓN MANUAL REQUERIDA
   * - Requiere decisión arquitectónica sobre VITE_BREATHING_CYCLE_MS en test
   * - Manual: Navegar a /relax → Iniciar breathing → Completar 70s → Verificar AppContextPack
   * - Ver test-cases/Test_Cases_Strategic_20.md para más detalles
   */

  test('sesión de breathing completada se registra en AppContextPack', async ({
    loggedInPage,
    page,
  }) => {
    test.skip();
  });
});
