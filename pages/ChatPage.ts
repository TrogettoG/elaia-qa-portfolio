import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Chat feature.
 *
 * Selectors for /chat route:
 * - Message input: textarea or input field
 * - Send button: button to submit message
 * - User message bubble: user's sent messages
 * - Elaia message bubble: AI assistant's responses
 * - Typing indicator: loading animation while AI processes
 */
export class ChatPage {
  readonly page: Page;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly typingIndicator: Locator;
  readonly messageContainer: Locator;
  readonly rateLimitError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Message input - try multiple selectors for robustness
    this.messageInput = page.locator('textarea').first();
    if (!this.messageInput) {
      this.messageInput = page.locator('input[type="text"]').first();
    }

    // Send button - look for buttons with common send indicators
    this.sendButton = page
      .locator('button')
      .filter({ has: page.locator('button:has(.lucide-send)') })
      .first();

    // If not found, try other selector patterns
    if (!this.sendButton) {
      this.sendButton = page.locator('button[type="submit"]').first();
    }

    // Typing indicator - animated dots or loading state
    this.typingIndicator = page.locator('[class*="typing"], [class*="loader"], [class*="animate"]').first();

    // Message container - where messages are displayed
    this.messageContainer = page.locator('[class*="message"], [class*="chat"], [class*="conversation"], [role="log"]').first();

    // Rate limit error - look for error messages mentioning rate limit, requests, connection errors, or trying again
    this.rateLimitError = page.locator(
      'text=/rate limit|demasiados|muy rápido|intentar|espera|requests|límite|error de conexión|connection error/i',
    ).first();
  }

  async gotoChat() {
    await this.page.goto('/chat');
  }

  async sendMessage(text: string) {
    await this.messageInput.fill(text);
    await this.messageInput.press('Enter'); // Try Enter first

    // If Enter didn't work, try clicking button
    const sendButtonVisible = await this.sendButton.isVisible().catch(() => false);
    if (sendButtonVisible) {
      await this.sendButton.click();
    }
  }

  async isTypingIndicatorVisible(): Promise<boolean> {
    return await this.typingIndicator.isVisible().catch(() => false);
  }

  async isRateLimitErrorVisible(): Promise<boolean> {
    return await this.rateLimitError.isVisible().catch(() => false);
  }

  async getMessageCount(): Promise<number> {
    return await this.page.locator('div:has-text("")').count();
  }

  async getLastMessage(): Promise<string | null> {
    const lastMessage = await this.page.locator('div').last().textContent();
    return lastMessage;
  }

  async getInputValue(): Promise<string> {
    return await this.messageInput.inputValue();
  }

  async getRateLimitErrorText(): Promise<string | null> {
    try {
      const errorText = await this.rateLimitError.textContent();
      return errorText;
    } catch (e) {
      return null;
    }
  }
}


