import { test } from '../../fixtures/auth.fixture';

test.describe('TC-021 | Eliminar entrada de journal', () => {
  /**
   * TC-021: Eliminar entrada de journal
   * Épica: Journal
   * Prioridad: No aplica
   *
   * Precondición: N/A (funcionalidad excluida del scope)
   * Backend: N/A
   *
   * Notas de diseño:
   * - Las entradas de journal son inmutables por diseño de producto
   * - Elaia es app de salud mental: el historial se debe preservar íntegramente
   * - TC-021 no aplica a la implementación actual
   */

  test.skip('Las entradas de journal son inmutables por diseño de producto', async () => {
    // Esta funcionalidad no existe ni debe existir en Elaia.
    // El historial de journal es parte integral del seguimiento de salud mental
    // y debe preservarse íntegramente para análisis y continuidad del tratamiento.
  });
});
