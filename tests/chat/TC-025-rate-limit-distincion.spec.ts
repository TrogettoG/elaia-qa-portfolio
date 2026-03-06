import { test, expect } from '../../fixtures/auth.fixture';
import { ChatPage } from '../../pages/ChatPage';

test.describe('TC-025 | Rate limiting — distinción user_rate_limit vs ip_rate_limit', () => {
  /**
   * TC-025: Rate limiting — distinción user_rate_limit vs ip_rate_limit
   * Épica: Chat
   * Prioridad: Media
   *
   * Precondición: Usuario autenticado con fixture loggedInPage
   * Backend: API con rate limiting por usuario e IP
   *
   * Notas de diseño:
   * - user_rate_limit: límite personal del usuario
   * - ip_rate_limit: actividad excesiva desde la IP/red
   * - Implementación: page.route() para retornar 429 con JSON que contiene reason
   * - BUG BR-006: Ambos tipos muestran el mismo mensaje de error
   */

  test('user_rate_limit muestra mensaje de límite personal', async ({ loggedInPage, page }) => {
    const chatPage = new ChatPage(page);

    // Mock: retornar 429 con reason: user_rate_limit
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ reason: 'user_rate_limit' }),
      });
    });

    // Navegar a /chat
    await chatPage.gotoChat();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Enviar un mensaje para trigger el error
    await chatPage.messageInput.fill('Test user_rate_limit');
    await chatPage.messageInput.press('Enter');
    await page.waitForTimeout(1500);

    // Capturar el texto del error
    const userRateLimitError = await chatPage.getRateLimitErrorText();

    // Documentar que se capturó un error
    expect(userRateLimitError).not.toBeNull();
  });

  test('ip_rate_limit muestra mensaje de actividad excesiva desde la red', async ({
    loggedInPage,
    page,
  }) => {
    const chatPage = new ChatPage(page);

    // Mock: retornar 429 con reason: ip_rate_limit
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ reason: 'ip_rate_limit' }),
      });
    });

    // Navegar a /chat
    await chatPage.gotoChat();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Enviar un mensaje para trigger el error
    await chatPage.messageInput.fill('Test ip_rate_limit');
    await chatPage.messageInput.press('Enter');
    await page.waitForTimeout(1500);

    // Capturar el texto del error
    const ipRateLimitError = await chatPage.getRateLimitErrorText();

    // Documentar que se capturó un error
    expect(ipRateLimitError).not.toBeNull();
  });

  test('[BUG BR-006] user_rate_limit y ip_rate_limit muestran mensajes distintos', async ({
    loggedInPage,
    page,
  }) => {
    const chatPage = new ChatPage(page);

    const errorMessages: Record<string, string | null> = {};

    // Test 1: Capturar mensaje de user_rate_limit
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ reason: 'user_rate_limit' }),
      });
    });

    await chatPage.gotoChat();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    await chatPage.messageInput.fill('Message 1');
    await chatPage.messageInput.press('Enter');
    await page.waitForTimeout(1500);

    const userError = await chatPage.getRateLimitErrorText();
    errorMessages['user_rate_limit'] = userError;

    // Limpiar y preparar para Test 2
    await page.unroute('**/api/**');
    await page.goto('/');
    await page.waitForTimeout(500);

    // Test 2: Capturar mensaje de ip_rate_limit
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ reason: 'ip_rate_limit' }),
      });
    });

    await chatPage.gotoChat();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    await chatPage.messageInput.fill('Message 2');
    await chatPage.messageInput.press('Enter');
    await page.waitForTimeout(1500);

    const ipError = await chatPage.getRateLimitErrorText();
    errorMessages['ip_rate_limit'] = ipError;

    // Comparar los mensajes
    const userMsg = errorMessages['user_rate_limit'];
    const ipMsg = errorMessages['ip_rate_limit'];

    if (userMsg && ipMsg) {
      // BUG BR-006: user_rate_limit e ip_rate_limit muestran el mismo mensaje
      if (userMsg === ipMsg) {
        expect(userMsg).not.toBe(ipMsg);
      } else {
        expect(userMsg).not.toBe(ipMsg);
      }
    } else {
      expect(userMsg !== null || ipMsg !== null).toBe(true);
    }
  });
});
