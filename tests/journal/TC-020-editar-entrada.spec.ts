import { test, expect } from '../../fixtures/auth.fixture';
import { JournalPage } from '../../pages/JournalPage';
import { JOURNAL, TIMEOUTS } from '../../data/test-data';

test.describe('TC-020 | Editar entrada de journal existente', () => {
  /**
   * TC-020: Editar entrada de journal existente
   * Épica: Journal
   * Prioridad: Alta
   *
   * Precondición: Usuario autenticado con fixture loggedInPage + entrada existente
   * Backend: Firebase Firestore + localStorage
   *
   * Notas de diseño:
   * - Funcionalidad de edición no está implementada en la app
   * - BUG BR-005: El botón de editar no existe en el timeline (US-010 / HAL-017)
   * - Todas las pruebas documentan la funcionalidad esperada con test.fail()
   */

  test('[BUG BR-005] botón de editar es visible en una entrada del timeline', async ({
    loggedInPage,
    page,
  }) => {
    // Setup: Crear una entrada fresh para tener algo que editar
    const journalPage = new JournalPage(page);

    await journalPage.entryTextArea.fill(JOURNAL.entryText);
    const moodButtons = await journalPage.moodSelectorButtons.all();
    await moodButtons[JOURNAL.mood].click();
    await journalPage.saveButton.click();
    await page.waitForTimeout(1500);

    // Navegar a journal para ver el timeline
    await journalPage.gotoJournal();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Assert: Buscar el botón de editar
    const editButtonVisible = await journalPage.editButton.isVisible();
    expect(editButtonVisible).toBe(true);
  });

  test('[BUG BR-005] edita el texto de una entrada existente y el cambio persiste', async ({
    loggedInPage,
    page,
  }) => {
    // Setup: Crear una entrada fresh para tener algo que editar
    const journalPage = new JournalPage(page);

    await journalPage.entryTextArea.fill(JOURNAL.entryText);
    const moodButtons = await journalPage.moodSelectorButtons.all();
    await moodButtons[JOURNAL.mood].click();
    await journalPage.saveButton.click();
    await page.waitForTimeout(1500);

    // Navegar a journal
    await journalPage.gotoJournal();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Verificar que el botón de editar existe (fallará aquí documentando el bug)
    const editButtonExists = await journalPage.editButton.isVisible().catch(() => false);
    expect(editButtonExists).toBe(true);

    // Si el botón existiera, se editaría así:
    await journalPage.editTextArea.clear();
    await journalPage.editTextArea.fill(JOURNAL.editedEntryText);

    await journalPage.saveEditButton.click();
    await page.waitForTimeout(1500);

    // Verificar que el cambio persiste
    const updatedText = await page.locator(`text=${JOURNAL.editedEntryText}`).isVisible();
    expect(updatedText).toBe(true);
  });

  test('[BUG BR-005] el valor actualizado en localStorage sigue encriptado', async ({
    loggedInPage,
    page,
  }) => {
    // Setup: Crear una entrada fresh para tener algo que editar
    const journalPage = new JournalPage(page);

    await journalPage.entryTextArea.fill(JOURNAL.entryText);
    const moodButtons = await journalPage.moodSelectorButtons.all();
    await moodButtons[JOURNAL.mood].click();
    await journalPage.saveButton.click();
    await page.waitForTimeout(1500);

    // Navegar a journal
    await journalPage.gotoJournal();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Verificar que el botón de editar existe (fallará aquí documentando el bug)
    const editButtonExists = await journalPage.editButton.isVisible().catch(() => false);
    expect(editButtonExists).toBe(true);

    // Si el botón existiera, se editaría así:
    await journalPage.editTextArea.clear();
    await journalPage.editTextArea.fill(JOURNAL.editedEntryText);

    await journalPage.saveEditButton.click();
    await page.waitForTimeout(1500);

    // Verificar localStorage
    const localStorageData = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const journalKey = keys.find(k => k.startsWith('elaia_journal_entries_'));
      if (journalKey) {
        return {
          key: journalKey,
          value: localStorage.getItem(journalKey),
        };
      }
      return null;
    });

    if (localStorageData) {
      // Assert: El valor no debe contener el texto plano
      const hasPlaintext = localStorageData.value?.includes(JOURNAL.editedEntryText);
      expect(hasPlaintext).toBe(false);

      // Assert: El valor debe estar encriptado (contener "Salted" o caracteres no legibles)
      const isEncrypted =
        localStorageData.value?.startsWith('Salted') ||
        /[^A-Za-z0-9+/=]/.test(localStorageData.value || '');
      expect(isEncrypted).toBe(true);
    } else {
      expect(localStorageData).not.toBeNull();
    }
  });
});
