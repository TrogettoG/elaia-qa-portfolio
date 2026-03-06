import { test, expect } from '../../fixtures/auth.fixture';
import { ChatPage } from '../../pages/ChatPage';
import { CHAT, TIMEOUTS } from '../../data/test-data';

test.describe('TC-029 | Memory cards — usuario FREE no recibe inyección en contextPack', () => {
  /**
   * TC-029: Memory cards — usuario FREE no recibe inyección en contextPack
   * Épica: Chat
   * Prioridad: Alta
   *
   * Precondición: Usuario FREE autenticado con fixture loggedInPage
   * Backend: LLM API con endpoint /api/chat (contextPack)
   *
   * Notas de diseño:
   * - El payload no contiene memory cards para usuarios FREE
   * - Elaia responde normalmente sin contexto de memoria personal
   * - Interceptar con page.route() y capturar request.postDataJSON()
   * - Verificar que memoryCards está vacío o no existe
   */

  test('el payload enviado al LLM no contiene memory cards para usuario FREE', async ({
    loggedInPage,
    page,
  }) => {
    const chatPage = new ChatPage(page);

    let capturedPayload: any = null;

    // Interceptar request al chat API y capturar payload
    await page.route('**/api/chat/**', async (route) => {
      const request = route.request();

      // Capturar el body del request
      const postData = await request.postDataJSON();
      capturedPayload = postData;

      // Dejar pasar el request real para que Elaia responda normalmente
      await route.continue();
    });

    // Navegar a /chat
    await chatPage.gotoChat();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Enviar mensaje
    await chatPage.sendMessage(CHAT.message);
    await page.waitForTimeout(2000);

    // Verificar que el payload fue capturado
    expect(capturedPayload).not.toBeNull();

    // Verificar que memoryCards no existe o está vacío
    const memoryCards = capturedPayload?.memoryCards ?? [];
    expect(memoryCards).toHaveLength(0);
  });

  test('Elaia responde normalmente sin contexto de memoria personal para usuario FREE', async ({
    loggedInPage,
    page,
  }) => {
    const chatPage = new ChatPage(page);

    // Navegar a /chat
    await chatPage.gotoChat();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Enviar mensaje
    await chatPage.sendMessage(CHAT.message);

    // Esperar a que aparezca el typing indicator o la respuesta
    let responseReceived = false;
    for (let i = 0; i < 20; i++) {
      const isTyping = await chatPage.isTypingIndicatorVisible();
      const messageCount = await chatPage.getMessageCount();

      if (isTyping || messageCount > 1) {
        responseReceived = true;
        break;
      }
      await page.waitForTimeout(500);
    }

    // Verificar que al menos el mensaje fue enviado (visible en historial o typing indicator)
    expect(responseReceived).toBe(true);
  });

  test('payload no contiene datos personales de memoria en memoryCards', async ({
    loggedInPage,
    page,
  }) => {
    const chatPage = new ChatPage(page);

    let capturedPayload: any = null;

    // Interceptar request al chat API
    await page.route('**/api/chat/**', async (route) => {
      const request = route.request();
      capturedPayload = await request.postDataJSON();
      await route.continue();
    });

    // Navegar y enviar mensaje
    await chatPage.gotoChat();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    await chatPage.sendMessage('Test payload validation');
    await page.waitForTimeout(2000);

    // Verificar payload
    expect(capturedPayload).not.toBeNull();

    // Verificar múltiples escenarios donde NO debería haber memory cards
    const memoryCards = capturedPayload?.memoryCards;
    const contextPack = capturedPayload?.contextPack;

    // memoryCards debería no existir o estar vacío
    expect(memoryCards === undefined || memoryCards === null || memoryCards.length === 0).toBe(true);

    // Si hay contextPack, no debería contener inyección de memory cards
    if (contextPack) {
      const hasMemoryInjection = JSON.stringify(contextPack).toLowerCase().includes('memory');
      expect(hasMemoryInjection).toBe(false);
    }
  });
});
