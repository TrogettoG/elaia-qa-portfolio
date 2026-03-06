import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Journal feature.
 *
 * Confirmed via MCP exploration 2026-03-04:
 * - Journal entry creation form is in the home/dashboard page
 * - Textarea with placeholder: "Escribe lo que tienes en mente..."
 * - Mood selector: 5 buttons with emojis (😁, 😊, 😐, 😔, 😫)
 * - Save button: "Guardar Entrada"
 * - Journal timeline is at /journal route with entries in timeline layout
 * - Entries have emoji mood, date, time, and text content
 */
export class JournalPage {
  readonly page: Page;

  // Entry creation form (in home/dashboard)
  readonly entryTextArea: Locator;
  readonly moodSelectorButtons: Locator;
  readonly saveButton: Locator;

  // Entry edit form
  readonly editButton: Locator;
  readonly editTextArea: Locator;
  readonly saveEditButton: Locator;

  // Journal timeline (/journal route)
  readonly timelineContainer: Locator;
  readonly timelineEntries: Locator;
  readonly entryContent: Locator;
  readonly entryMood: Locator;
  readonly entryDate: Locator;
  readonly entryTime: Locator;

  constructor(page: Page) {
    this.page = page;

    // Entry creation form
    this.entryTextArea = page.locator('textarea[placeholder*="Escribe"]');
    // Mood buttons: 5 buttons with emojis (😁, 😊, 😐, 😔, 😫)
    this.moodSelectorButtons = page.locator(
      'button:has(div:has-text("😁")), button:has(div:has-text("😊")), button:has(div:has-text("😐")), button:has(div:has-text("😔")), button:has(div:has-text("😫"))',
    );
    this.saveButton = page.locator('button:has-text("Guardar Entrada")');

    // Entry edit form (NOT YET IMPLEMENTED - BUG TC-020)
    this.editButton = page.locator('button[aria-label*="ditar"], button:has-text("Editar")').first();
    this.editTextArea = page.locator('textarea[placeholder*="Edita"]');
    this.saveEditButton = page.locator('button:has-text("Guardar Cambios")');

    // Journal timeline
    this.timelineContainer = page.locator('.relative.z-10.max-w-md.mx-auto > div[class*="space-y"]');
    this.timelineEntries = page.locator('.relative.pl-16');
    this.entryContent = page.locator('div.bg-white p, p[class*="text-indigo"]');
    this.entryMood = page.locator('div[class*="text-2xl"]'); // emoji mood
    this.entryDate = page.locator('span.text-xs.font-medium');
    this.entryTime = page.locator('span.text-sm.font-light');
  }

  async gotoJournal() {
    await this.page.goto('/journal');
  }

  async createEntry(text: string, moodIndex: number = 0) {
    await this.entryTextArea.fill(text);
    const moodButtons = await this.moodSelectorButtons.all();
    if (moodButtons.length > moodIndex) {
      await moodButtons[moodIndex].click();
    }
    await this.saveButton.click();
  }

  async getLatestEntryText(): Promise<string | null> {
    // Entry text is in paragraphs with class "text-indigo-950/80"
    // Get the last paragraph that contains entry content
    const entryContent = this.page.locator('p.text-indigo-950\\/80');
    return await entryContent.last().textContent();
  }

  async getEntryCount(): Promise<number> {
    // Each entry is a div with class "relative pl-16"
    return await this.timelineEntries.count();
  }
}
