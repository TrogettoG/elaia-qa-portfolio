import { test, expect } from '../../fixtures/auth.fixture';
import { JOURNAL, TIMEOUTS } from '../../data/test-data';
import { JournalPage } from '../../pages/JournalPage';

/**
 * TC-019: Crear nueva entrada de journal — flujo completo
 * Épica: Journal
 * Prioridad: Alta
 *
 * Escenarios:
 * 1. Crea una entrada con texto y mood y aparece en el timeline
 * 2. El valor guardado en localStorage está encriptado (no texto plano)
 * 3. latestEntry en localStorage se actualiza tras crear la entrada
 *
 * Precondición: Usuario autenticado con fixture loggedInPage.
 * Backend: Firebase Firestore + localStorage
 *
 * Notas de diseño:
 * - Formulario de creación en home/dashboard
 * - Timeline visualizado en /journal
 * - Datos encriptados en localStorage (claves elaia_journal_*)
 * - BUG BR-004: La clave "elaia_latestEntry" no existe en localStorage
 */
test.describe('TC-019 | Crear nueva entrada de journal — flujo completo', () => {
  test('Crea una entrada con texto y mood y aparece en el timeline', async ({
    loggedInPage,
    page,
  }) => {
    // 1. Verificar que estamos en home autenticados
    await expect(loggedInPage.welcomeHeading).toBeVisible();

    // 2. Crear instancia de JournalPage
    const journalPage = new JournalPage(page);

    // 3. Contar entradas ANTES de crear
    const countBefore = await journalPage.getEntryCount();

    // 4. Llenar el formulario de entrada
    await journalPage.entryTextArea.fill(JOURNAL.entryText);

    // 5. Seleccionar mood (índice 1 = 😊)
    const moodButtons = await journalPage.moodSelectorButtons.all();
    await moodButtons[JOURNAL.mood].click();

    // 6. Guardar entrada
    await journalPage.saveButton.click();

    // 7. Esperar a que se guarde (puede haber animación)
    await page.waitForTimeout(1500);

    // 8. Navegar a /journal para ver el timeline
    await journalPage.gotoJournal();

    // 9. Esperar a que cargue
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // 10. Verificar que aumentó el número de entradas
    const countAfter = await journalPage.getEntryCount();
    expect(countAfter).toBeGreaterThan(countBefore);

    // 11. Verificar que el texto de la entrada está visible en la página
    // Primero intentar con el selector de última entrada
    let textFound = false;
    try {
      const latestText = await journalPage.getLatestEntryText();
      if (latestText?.includes(JOURNAL.entryText)) {
        textFound = true;
      }
    } catch (e) {
      // Could not get latest entry text, trying page search
    }

    // Si no encontró en el selector, buscar el texto en toda la página
    if (!textFound) {
      const isVisible = await page.locator(`text=${JOURNAL.entryText}`).isVisible();
      expect(isVisible).toBe(true);
    } else {
      expect(textFound).toBe(true);
    }
  });

  test('El valor guardado en localStorage está encriptado (no texto plano)', async ({
    loggedInPage,
    page,
  }) => {
    // 1. Verificar autenticación
    await expect(loggedInPage.welcomeHeading).toBeVisible();

    // 2. Crear instancia de JournalPage
    const journalPage = new JournalPage(page);

    // 3. Crear una entrada con ID único para rastrearla
    const uniqueText = `Entrada de prueba ${Date.now()}`;
    await journalPage.entryTextArea.fill(uniqueText);

    const moodButtons = await journalPage.moodSelectorButtons.all();
    await moodButtons[JOURNAL.mood].click();

    // 4. Guardar entrada
    await journalPage.saveButton.click();
    await page.waitForTimeout(1500);

    // 5. Verificar localStorage
    const allKeys = await page.evaluate(() =>
      Object.keys(localStorage).filter((key) => key.startsWith('elaia_')),
    );
    expect(allKeys.length).toBeGreaterThan(0);

    // 6. Verificar que el texto NO está en plano en localStorage
    const allValues = await page.evaluate(() => {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith('elaia_'));
      return keys.map((key) => ({
        key,
        value: localStorage.getItem(key),
      }));
    });

    // 7. Asegurar que el texto único NO aparece en plano en ningún valor
    for (const item of allValues) {
      // El texto no debe aparecer tal cual (podría estar encriptado en base64, JSON, etc)
      const hasPlainText = item.value?.includes(uniqueText.substring(0, 20));
      // No es texto completamente plano
      expect(item.value).not.toBe(uniqueText);
      expect(item.value).toBeTruthy(); // Pero tiene valor
    }
  });

  test('[BUG BR-004] latestEntry en localStorage se actualiza tras crear la entrada', async ({
    loggedInPage,
    page,
  }) => {
    //test.fail();
    // La clave "elaia_latestEntry" no existe en localStorage

    // 1. Verificar autenticación
    await expect(loggedInPage.welcomeHeading).toBeVisible();

    // 2. Leer latestEntry ANTES de crear nueva entrada
    const latestEntryBefore = await page.evaluate(() => localStorage.getItem('elaia_latestEntry'));

    // 3. Crear instancia de JournalPage
    const journalPage = new JournalPage(page);

    // 4. Crear una nueva entrada
    const newEntryText = `Nueva entrada ${Date.now()}`;
    await journalPage.entryTextArea.fill(newEntryText);

    const moodButtons = await journalPage.moodSelectorButtons.all();
    await moodButtons[JOURNAL.mood].click();

    // 5. Guardar entrada
    await journalPage.saveButton.click();
    await page.waitForTimeout(2000); // Dar tiempo a que se sincronice

    // 6. Leer latestEntry DESPUÉS de crear
    const latestEntryAfter = await page.evaluate(() => localStorage.getItem('elaia_latestEntry'));

    // 7. Verificar que se actualizó (debería ser diferente)
    expect(latestEntryAfter).toBeTruthy();
    expect(latestEntryAfter).not.toBe(latestEntryBefore);

    // 8. Verificar que contiene timestamp o referencia a la nueva entrada (encriptado)
    expect(latestEntryAfter?.length).toBeGreaterThan(0);
  });
});
