import type { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get url(): string {
    return this.page.url();
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async pauseForManualInput(): Promise<void> {
    await this.page.pause();
  }
}
