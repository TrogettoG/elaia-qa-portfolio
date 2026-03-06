import { test } from '../../fixtures/auth.fixture';

test.describe('TC-037 | Breathing Exercise — sesión interrumpida en AppContextPack', () => {
  /**
   * TC-037: Breathing Exercise — sesión interrumpida en AppContextPack
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
   * - Manual: Navegar a /relax → Iniciar breathing → Interrumpir a los 30-40s → Verificar AppContextPack
   */

  test.skip('sesión de breathing interrumpida se registra en AppContextPack', async ({
    loggedInPage,
    page,
  }) => {
    //test.skip();
  });
});
