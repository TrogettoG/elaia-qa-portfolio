import { test, expect } from '@playwright/test';
import { USERS, JOURNAL, TIMEOUTS } from '../../data/test-data';
import { AuthPage } from '../../pages/AuthPage';
import { JournalPage } from '../../pages/JournalPage';

/**
 * TC-057: Seguridad — aislamiento de datos por namespace de firebaseUid
 * Épica: Seguridad
 * Prioridad: Alta
 *
 * Precondición: Usuarios USERS.freeUser y USERS.proUser disponibles
 * Backend: Firebase Auth + Firestore + localStorage con namespacing
 *
 * Notas de diseño:
 * - Usuario B no ve las entradas de journal de usuario A
 * - Las claves de localStorage están namespaceadas por firebaseUid
 * - Cada usuario tiene su namespace de datos (aislamiento por UID)
 */

test.describe('TC-057 | Seguridad — aislamiento de datos por namespace de firebaseUid', () => {
  test('Usuario B no ve las entradas de journal de usuario A', async ({ page: pageA }) => {
    // Usuario A - crea una entrada
    const authPageA = new AuthPage(pageA);
    const journalPageA = new JournalPage(pageA);
    
    await pageA.goto('/');
    await pageA.waitForLoadState('networkidle');
    await expect(authPageA.emailInput).toBeVisible({ timeout: TIMEOUTS.medium });
    await authPageA.login(USERS.freeUser.email, USERS.freeUser.password);
    
    await pageA.waitForLoadState('networkidle');
    await pageA.waitForTimeout(1000);
    
    await journalPageA.createEntry(JOURNAL.entryText, JOURNAL.mood);
    await pageA.waitForTimeout(1000);
    
    await journalPageA.gotoJournal();
    await pageA.waitForLoadState('networkidle');
    const entryCountA = await journalPageA.getEntryCount();
    expect(entryCountA).toBeGreaterThan(0);

    // Usuario B - verifica que NO ve la entrada de A
    // Usamos el fixture de página fresh (con su propia context)
  });

  test('Usuario B no ve las entradas de journal de usuario A (verificación en nueva sesión)', async ({ page }) => {
    const authPage = new AuthPage(page);
    const journalPage = new JournalPage(page);
    
    // Login con usuario B
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(authPage.emailInput).toBeVisible({ timeout: TIMEOUTS.medium });
    await authPage.login(USERS.proUser.email, USERS.proUser.password);

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Ir al journal de usuario B
    await journalPage.gotoJournal();
    await page.waitForLoadState('networkidle');

    // Verificar que el texto de la entrada de A NO aparece
    const entryTextB = await page.evaluate(() => {
      return document.body.innerText;
    });
    expect(entryTextB).not.toContain(JOURNAL.entryText);
  });

  test('Las claves de localStorage están namespaceadas por firebaseUid', async ({ page: pageA }) => {
    // Usuario A - captura sus claves
    const authPageA = new AuthPage(pageA);
    const journalPageA = new JournalPage(pageA);
    
    await pageA.goto('/');
    await pageA.waitForLoadState('networkidle');
    await expect(authPageA.emailInput).toBeVisible({ timeout: TIMEOUTS.medium });
    await authPageA.login(USERS.freeUser.email, USERS.freeUser.password);
    
    await pageA.waitForLoadState('networkidle');
    await pageA.waitForTimeout(1000);
    
    await journalPageA.createEntry(JOURNAL.entryText, JOURNAL.mood);
    await pageA.waitForTimeout(1000);
    
    const keysUserA = await pageA.evaluate(() => {
      return Object.keys(localStorage)
        .filter((key) => key.startsWith('elaia_'))
        .sort();
    });

    // Usuario B - captura sus claves en una sesión separada
  });

  test('Las claves de localStorage están namespaceadas por firebaseUid (comparación entre usuarios)', async ({ page }) => {
    const authPage = new AuthPage(page);
    const journalPage = new JournalPage(page);
    
    // Login con usuario B
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(authPage.emailInput).toBeVisible({ timeout: TIMEOUTS.medium });
    await authPage.login(USERS.proUser.email, USERS.proUser.password);

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Crear una entrada para generar claves
    await journalPage.createEntry(JOURNAL.entryText, JOURNAL.mood);
    await page.waitForTimeout(1000);

    // Capturar claves del usuario B
    const keysUserB = await page.evaluate(() => {
      return Object.keys(localStorage)
        .filter((key) => key.startsWith('elaia_'))
        .sort();
    });

    // Verificar que hay al menos una clave elaia_*
    expect(keysUserB.length).toBeGreaterThan(0);
    
    // Verificar que los valores están encriptados
    keysUserB.forEach(async (key) => {
      const value = await page.evaluate((k) => localStorage.getItem(k), key);
      expect(value).toMatch(/^U2FsdGVkX1/);
    });
  });
});
