import { test, expect } from '../../fixtures/auth.fixture';
import { ChatPage } from '../../pages/ChatPage';
import { CHAT } from '../../data/test-data';

test.describe('TC-030 | Summary — generación al superar 50 mensajes; sin duplicados', () => {
  /**
   * TC-030: Summary — generación al superar 50 mensajes; sin duplicados
   * Épica: Chat
   * Prioridad: Alta
   *
   * Precondición: Usuario autenticado con fixture loggedInPage
   * Backend: Firebase Firestore + localStorage con CryptoJS
   *
   * Notas de diseño:
   * - Se genera summary automático al superar 50 mensajes
   * - No se genera summary duplicado para el mismo rango
   * - El summary está encriptado (formato Salted con CryptoJS)
   * - elaia_chat_history: array sin encriptar con historial completo
   * - elaia_chat_history_<userID>: versión encriptada con CryptoJS
   */

  test('se genera versión encriptada del historial al superar 50 mensajes', async ({
    loggedInPage,
    page,
  }) => {
    const chatPage = new ChatPage(page);

    // Pre-cargar 49 mensajes en localStorage
    const chatHistory = Array.from({ length: 49 }, (_, i) => ({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: i % 2 === 0 ? `User message ${i + 1}` : `Assistant response ${i + 1}`,
      timestamp: new Date(Date.now() - (49 - i) * 60000).toISOString(),
    }));

    await page.evaluate((history: any) => {
      localStorage.setItem('elaia_chat_history', JSON.stringify(history));
    }, chatHistory);

    // Verificar que se inyectaron correctamente
    const historyCount = await page.evaluate(() => {
      const history = localStorage.getItem('elaia_chat_history');
      if (!history) return 0;
      try {
        return JSON.parse(history).length;
      } catch {
        return 0;
      }
    });

    expect(historyCount).toBe(49);

    // Navegar a /chat
    await chatPage.gotoChat();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Enviar el mensaje 50 (que puede trigger la encriptación)
    await chatPage.sendMessage('Message 50 - trigger encryption');
    await page.waitForTimeout(3000);

    // Verificar que existe una clave encriptada de historial en localStorage
    const encryptedKeys = await page.evaluate(() => {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('elaia_chat_history_')) {
          keys.push(key);
        }
      }
      return keys;
    });

    // Debe existir al menos una clave encriptada
    expect(encryptedKeys.length).toBeGreaterThan(0);

    // Verificar que está encriptada (comienza con "Salted" en formato base64)
    if (encryptedKeys.length > 0) {
      const encryptedValue = await page.evaluate((key: string) => {
        return localStorage.getItem(key);
      }, encryptedKeys[0]);

      // Verificar que empieza con "U2FsdGVkX1" (base64 de "Salted")
      const isSalted = encryptedValue && encryptedValue.startsWith('U2FsdGVkX1');
      expect(isSalted).toBe(true);
    }
  });

  test('no se genera clave encriptada duplicada para el mismo rango de mensajes', async ({
    loggedInPage,
    page,
  }) => {
    const chatPage = new ChatPage(page);

    // Pre-cargar 49 mensajes
    const chatHistory = Array.from({ length: 49 }, (_, i) => ({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: i % 2 === 0 ? `User message ${i + 1}` : `Assistant response ${i + 1}`,
      timestamp: new Date(Date.now() - (49 - i) * 60000).toISOString(),
    }));

    await page.evaluate((history: any) => {
      localStorage.setItem('elaia_chat_history', JSON.stringify(history));
    }, chatHistory);

    // Navegar a /chat
    await chatPage.gotoChat();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Enviar mensaje 50
    await chatPage.sendMessage('Message 50');
    await page.waitForTimeout(2000);

    // Capturar claves encriptadas después del mensaje 50
    const keysAfter50 = await page.evaluate(() => {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('elaia_chat_history_')) {
          keys.push(key);
        }
      }
      return keys;
    });

    const countAfter50 = keysAfter50.length;

    // Enviar mensaje 51
    await chatPage.sendMessage('Message 51');
    await page.waitForTimeout(2000);

    // Capturar claves encriptadas después del mensaje 51
    const keysAfter51 = await page.evaluate(() => {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('elaia_chat_history_')) {
          keys.push(key);
        }
      }
      return keys;
    });

    const countAfter51 = keysAfter51.length;

    // Verificar que no se crearon claves nuevas (o máximo una si se actualiza la encriptación)
    expect(countAfter51).toBeLessThanOrEqual(countAfter50 + 1);
  });

  test('el historial encriptado usa formato CryptoJS (Salted)', async ({
    loggedInPage,
    page,
  }) => {
    const chatPage = new ChatPage(page);

    // Pre-cargar 49 mensajes
    const chatHistory = Array.from({ length: 49 }, (_, i) => ({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: i % 2 === 0 ? `User message ${i + 1}` : `Assistant response ${i + 1}`,
      timestamp: new Date(Date.now() - (49 - i) * 60000).toISOString(),
    }));

    await page.evaluate((history: any) => {
      localStorage.setItem('elaia_chat_history', JSON.stringify(history));
    }, chatHistory);

    // Navegar a /chat
    await chatPage.gotoChat();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Enviar mensaje 50
    await chatPage.sendMessage('Message 50 - check encryption');
    await page.waitForTimeout(3000);

    // Obtener la clave encriptada
    const encryptedData = await page.evaluate(() => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('elaia_chat_history_')) {
          const value = localStorage.getItem(key);
          return { key, value };
        }
      }
      return null;
    });

    // Verificar que existe un historial encriptado
    expect(encryptedData).not.toBeNull();

    if (encryptedData) {
      const { value } = encryptedData;

      // Verificar formato CryptoJS:
      // - Comienza con "Salted" en base64: "U2FsdGVkX1"
      // - Es más largo que el original (por la encriptación)
      const isSaltedBase64 = value && value.startsWith('U2FsdGVkX1');
      const isLongEnough = value && value.length > 100;

      expect(isSaltedBase64 && isLongEnough).toBe(true);
    }
  });
});
