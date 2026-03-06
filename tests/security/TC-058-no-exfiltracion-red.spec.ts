import { test, expect } from '../../fixtures/auth.fixture';
import { JOURNAL, TIMEOUTS } from '../../data/test-data';
import { JournalPage } from '../../pages/JournalPage';

/**
 * TC-058: Seguridad — no exfiltración de datos del journal por red
 * Épica: Seguridad
 * Prioridad: Alta
 *
 * Precondición: Usuario autenticado con fixture loggedInPage + entrada de journal
 * Backend: Firebase + network monitoring (page.on('request'))
 *
 * Notas de diseño:
 * - Visualizar el timeline no genera requests con datos de entradas
 * - Los datos del journal no se envían a servidores externos
 * - Se capturan requests vía page.on('request')
 * - Se verifica que ningún request contiene texto de la entrada
 */

test.describe('TC-058 | Seguridad — no exfiltración de datos del journal por red', () => {
  test('Visualizar el timeline de journal no genera requests de red con datos de entradas', async ({
    loggedInPage,
    page,
  }) => {
    // 1. Crear una entrada de journal
    const journalPage = new JournalPage(page);
    await journalPage.createEntry(JOURNAL.entryText, JOURNAL.mood);

    // 2. Esperar a que la entrada se guarde
    await page.waitForTimeout(1000);

    // 3. Capturar todos los requests de red durante la navegación a /journal
    const capturedRequests: { url: string; method: string; postData?: string }[] = [];

    const requestHandler = (request: any) => {
      capturedRequests.push({
        url: request.url(),
        method: request.method(),
        postData: request.postData(),
      });
    };

    page.on('request', requestHandler);

    // 4. Navegar a /journal
    await journalPage.gotoJournal();
    await page.waitForLoadState('networkidle');

    // 5. Scrollear por el timeline para asegurar carga completa
    await page.evaluate(() => {
      window.scrollBy(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    // 6. Detener captura de requests
    page.off('request', requestHandler);

    // 7. Filtrar requests que no sean autenticación Firebase, googleapis o assets
    const suspiciousRequests = capturedRequests.filter((req) => {
      const url = req.url.toLowerCase();
      const isFirebase =
        url.includes('firebase.com') ||
        url.includes('firebaseapp.com') ||
        url.includes('googleapis.com');
      const isVercel =
        url.includes('vercel.app') ||
        url.includes('vercel.com') ||
        url.includes('cdn.vercel-dns.com');
      const isAsset = /\.(js|css|woff|png|svg|jpg|gif|webp|ico)($|\?)/i.test(url);

      return !isFirebase && !isVercel && !isAsset;
    });

    // 8. Verificar que ningún request contiene el texto de la entrada
    suspiciousRequests.forEach((req) => {
      expect(req.url).not.toContain(JOURNAL.entryText);
      if (req.postData) {
        expect(req.postData).not.toContain(JOURNAL.entryText);
      }
    });
  });

  test('Los datos del journal no se envían a ningún servidor externo', async ({
    loggedInPage,
    page,
  }) => {
    // 1. Crear una entrada de journal
    const journalPage = new JournalPage(page);
    await journalPage.createEntry(JOURNAL.entryText, JOURNAL.mood);

    // 2. Esperar a que la entrada se guarde
    await page.waitForTimeout(1000);

    // 3. Capturar todos los POST/PUT requests
    const postPutRequests: { url: string; method: string; postData?: string }[] = [];

    const requestHandler = (request: any) => {
      const method = request.method();
      if (method === 'POST' || method === 'PUT') {
        postPutRequests.push({
          url: request.url(),
          method: method,
          postData: request.postData(),
        });
      }
    };

    page.on('request', requestHandler);

    // 4. Navegar a /journal y scrollear
    await journalPage.gotoJournal();
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      window.scrollBy(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    // 5. Detener captura
    page.off('request', requestHandler);

    // 6. Filtrar requests POST/PUT a dominios externos (no Firebase, googleapis, Vercel)
    const externalPostPutRequests = postPutRequests.filter((req) => {
      const url = req.url.toLowerCase();
      const isFirebase =
        url.includes('firebase.com') ||
        url.includes('firebaseapp.com') ||
        url.includes('identitytoolkit.googleapis.com');
      const isVercel =
        url.includes('vercel.app') ||
        url.includes('vercel.com') ||
        url.includes('cdn.vercel-dns.com');

      return !isFirebase && !isVercel;
    });

    // 7. Verificar que no hay requests POST/PUT externos
    externalPostPutRequests.forEach((req) => {
      // Si hay requests externos, no deben contener datos del journal
      expect(req.postData || '').not.toContain(JOURNAL.entryText);
    });

    // 8. Verificar que todos los POST/PUT son a servicios autorizados
    postPutRequests.forEach((req) => {
      const url = req.url.toLowerCase();
      const isAuthorized =
        url.includes('firebase.com') ||
        url.includes('firebaseapp.com') ||
        url.includes('googleapis.com') ||
        url.includes('vercel.app') ||
        url.includes('vercel.com');

      expect(isAuthorized).toBe(true);
    });
  });
});
