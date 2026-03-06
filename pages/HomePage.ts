import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Home/Dashboard screen.
 *
 * Confirmed via MCP exploration 2026-03-03:
 * - Welcome heading: <h1>Hola, Usuario</h1>
 * - Bottom nav with icons: Home, Journal, Relax, Analysis, Chat
 * - Mood selector with emoji buttons
 * - Journal textarea
 */
export class HomePage {
  readonly page: Page;

  readonly welcomeHeading: Locator;
  readonly moodSelector: Locator;
  readonly journalTextarea: Locator;
  readonly navHome: Locator;
  readonly navJournal: Locator;
  readonly navRelax: Locator;
  readonly navAnalysis: Locator;
  readonly navChat: Locator;

  constructor(page: Page) {
    this.page = page;

    this.welcomeHeading  = page.locator('h1:has-text("Hola")');
    this.moodSelector    = page.locator('[class*="mood"], [class*="emoji"]').first();
    this.journalTextarea = page.locator('textarea').first();

    // Bottom navigation (confirmed as icon buttons)
    this.navHome     = page.locator('nav a[href="/"], nav button').nth(0);
    this.navJournal  = page.locator('nav a[href*="journal"], nav button').nth(1);
    this.navRelax    = page.locator('nav a[href*="relax"], nav button').nth(2);
    this.navAnalysis = page.locator('nav a[href*="analysis"], nav button').nth(3);
    this.navChat     = page.locator('nav a[href*="chat"], nav button').nth(4);
  }

  async isLoaded(): Promise<boolean> {
    return this.welcomeHeading.isVisible();
  }
}
