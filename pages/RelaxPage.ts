import { Page, Locator } from '@playwright/test';

export class RelaxPage {
  readonly page: Page;
  readonly exerciseList: Locator;
  readonly playButton: Locator;
  readonly stopButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.exerciseList = page.locator('[class*="exercise"], [class*="relax"] li').first();
    this.playButton = page.locator('button:has-text("Iniciar"), button[aria-label*="play" i]').first();
    this.stopButton = page.locator('button:has-text("Detener"), button[aria-label*="stop" i]').first();
  }
}
