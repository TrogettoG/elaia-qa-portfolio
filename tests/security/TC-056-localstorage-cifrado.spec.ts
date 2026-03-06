import { test, expect } from '../../fixtures/auth.fixture';
import { JOURNAL, TIMEOUTS } from '../../data/test-data';
import { JournalPage } from '../../pages/JournalPage';

/**
 * TC-056: Seguridad — datos en localStorage encriptados con AES
 * Épica: Seguridad
 * Prioridad: Alta
 *
 * Precondición: Usuario autenticado con fixture loggedInPage + entrada de journal
 * Backend: CryptoJS con AES, localStorage
 *
 * Notas de diseño:
 * - Ningún valor de localStorage contiene PII en texto plano
 * - Las claves elaia_ tienen valores con formato CryptoJS (U2FsdGVkX1 = Salted)
 * - El texto de una entrada de journal no aparece en plano en localStorage
 */

test.describe('TC-056 | Seguridad — datos en localStorage encriptados con AES', () => {
  test('Ningún valor de localStorage contiene PII en texto plano', async ({
    loggedInPage,
    page,
  }) => {
    // 1. Crear una entrada de journal con texto sensible
    const journalPage = new JournalPage(page);
    await journalPage.createEntry(JOURNAL.entryText, JOURNAL.mood);

    // 2. Esperar a que la entrada se guarde
    await page.waitForTimeout(1000);

    // 3. Obtener todos los valores de localStorage
    const allStorageValues = await page.evaluate(() => {
      return Object.entries(localStorage).map(([key, value]) => ({
        key,
        value,
      }));
    });

    // 4. Verificar que ningún valor contiene el texto de la entrada en plano
    allStorageValues.forEach(({ key, value }) => {
      expect(value).not.toContain(JOURNAL.entryText);
    });
  });

  test('Las claves elaia_ tienen valores con formato CryptoJS (U2FsdGVkX1)', async ({
    loggedInPage,
    page,
  }) => {
    // 1. Crear una entrada de journal
    const journalPage = new JournalPage(page);
    await journalPage.createEntry(JOURNAL.entryText, JOURNAL.mood);

    // 2. Esperar a que la entrada se guarde
    await page.waitForTimeout(1000);

    // 3. Obtener las claves elaia_* de localStorage
    const elaiaKeys = await page.evaluate(() => {
      return Object.entries(localStorage)
        .filter(([key]) => key.startsWith('elaia_'))
        .map(([key, value]) => ({
          key,
          value,
        }));
    });

    // 4. Verificar que hay al menos una clave elaia_*
    expect(elaiaKeys.length).toBeGreaterThan(0);

    // 5. Verificar que todos los valores encriptados comienzan con U2FsdGVkX1
    elaiaKeys.forEach(({ key, value }) => {
      expect(value).toMatch(/^U2FsdGVkX1/);
    });
  });

  test('El texto de una entrada de journal no aparece en plano en localStorage', async ({
    loggedInPage,
    page,
  }) => {
    // 1. Crear una entrada de journal con texto específico
    const journalPage = new JournalPage(page);
    await journalPage.createEntry(JOURNAL.entryText, JOURNAL.mood);

    // 2. Esperar a que la entrada se guarde
    await page.waitForTimeout(1000);

    // 3. Verificar que el texto de la entrada NO aparece en plano en localStorage
    const entryTextFound = await page.evaluate((searchText) => {
      return Object.values(localStorage).some((value) => value.includes(searchText));
    }, JOURNAL.entryText);

    expect(entryTextFound).toBe(false);
  });
});
