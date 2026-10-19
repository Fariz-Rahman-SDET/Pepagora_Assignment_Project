import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { buyingRequestPath } from '../config/env';

export class BuyingRequestPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get productInput(): Locator {
    return this.page.getByPlaceholder(
      'e.g. Brazilian Virgin Hair, Organic Cotton T Shirts...',
    );
  }

  get quantityInput(): Locator {
    return this.page.locator('[name="estOrderQuantity.quantity"]');
  }

  get unitLabel(): Locator {
    return this.page.locator('.pbrNewFlowS1UnitField .p-dropdown-label');
  }

  get destinationCountryInput(): Locator {
    return this.page.getByPlaceholder('e.g. India');
  }

  get destinationCityInput(): Locator {
    return this.page.getByPlaceholder('e.g. Chennai');
  }

  get continueToEnrichmentButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue to Enrich' });
  }

  get continueToPostButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue to post' });
  }

  get enrichedPostOption(): Locator {
    return this.page.getByRole('button', { name: /Enriched post/ });
  }

  get basicPostOption(): Locator {
    return this.page.getByRole('button', { name: /Post basic/ });
  }

  get basicPostConfirmation(): Locator {
    return this.page.getByRole('heading', {
      name: /Your basic request is submitted/,
    });
  }

  get publishButton(): Locator {
    return this.page.getByRole('button', { name: 'Publish as a Hot Lead' });
  }

  get publishedAlert(): Locator {
    return this.page.getByRole('alert').filter({
      hasText: 'Your buying request was published.',
    });
  }

  get publishedStatus(): Locator {
    return this.page.getByText('Submitted. Your Hot Lead is under review', {
      exact: true,
    });
  }

  get quickPostHeading(): Locator {
    return this.page.getByRole('heading', { name: 'What are you looking for?' });
  }

  publishedRequestHeading(productName: string): Locator {
    return this.page
      .getByRole('heading', { level: 2 })
      .filter({ hasText: productName });
  }

  publishedDetails(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  get enrichmentHeader(): Locator {
    return this.page.getByText(/phase 2 of 2 - enrichment/i);
  }

  enrichmentSummary(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  get smartQuestionBlocks(): Locator {
    return this.page.locator('.pbrNewFlowS2AiAttrBlock');
  }

  get addMoreAttributesButton(): Locator {
    return this.page.getByRole('button', { name: /Add More Attributes/ });
  }

  get attributeNameInput(): Locator {
    return this.page.getByPlaceholder(
      'Attribute name e.g. Brand, Origin, T',
      { exact: true },
    );
  }

  get attributeValueInput(): Locator {
    return this.page.getByPlaceholder('Value e.g. Tata, India, 2mm', {
      exact: true,
    });
  }

  get scorePanel(): Locator {
    return this.page.getByRole('complementary');
  }

  get currencyDisplay(): Locator {
    return this.page.locator('[aria-label="Select Currency"]').locator('..');
  }

  get additionalDetailsInput(): Locator {
    return this.page.locator('textarea[name="pbrNewFlowS2Additional"]');
  }

  async open(): Promise<void> {
    await this.navigateTo(buyingRequestPath);
  }

  async selectProduct(
    productName: string,
    suggestionPattern: RegExp,
  ): Promise<string> {
    await this.productInput.fill(productName);
    const suggestion = this.page
      .getByRole('option', { name: suggestionPattern })
      .last();
    await suggestion.waitFor({ state: 'visible', timeout: 10_000 });
    const selectedProduct = (await suggestion.innerText()).trim();
    const attributesResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('/sales/ai/get-ai-attributes') &&
        (response.request().postData() ?? '').includes(selectedProduct),
      { timeout: 15_000 },
    );
    await suggestion.click();
    const response = await attributesResponse;
    if (!response.ok()) {
      throw new Error(
        `Product attributes request failed with HTTP ${response.status()}.`,
      );
    }
    return selectedProduct;
  }

  async fillQuantity(quantity: string): Promise<void> {
    await this.quantityInput.fill(quantity);
  }

  async continueToEnrichment(): Promise<void> {
    await this.continueToEnrichmentButton.click();
  }

  async continueToPost(): Promise<void> {
    await this.continueToPostButton.click();
  }

  async selectEnrichedPost(): Promise<void> {
    await this.enrichedPostOption.click();
  }

  smartAnswerButton(blockIndex: number): Locator {
    return this.smartQuestionBlocks
      .nth(blockIndex)
      .locator('button.pbrNewFlowS2Pill')
      .first();
  }

  async addCustomAttribute(name: string, value: string): Promise<void> {
    if ((await this.addMoreAttributesButton.getAttribute('aria-expanded')) !== 'true') {
      await this.addMoreAttributesButton.click();
    }

    await this.attributeNameInput.waitFor({ state: 'visible' });
    await this.attributeNameInput.fill(name);
    await this.attributeValueInput.fill(value);
    await this.page.getByRole('button', { name: 'Add', exact: true }).last().click();
  }

  async selectOption(value: string): Promise<void> {
    await this.page.getByRole('button', { name: value, exact: true }).click();
  }

  async fillBudgetRange(
    choice: string,
    from: string,
    to: string,
    currency: string,
  ): Promise<void> {
    await this.page.getByRole('button', { name: choice }).click();
    const rangeInputs = this.page.locator('input[placeholder="0"]');
    await rangeInputs.nth(0).fill(from);
    await rangeInputs.nth(1).fill(to);
    await this.page.locator('[aria-label="Select Currency"]').click();
    await this.page.getByRole('option', { name: currency }).click();
  }

  async fillDestination(country: string, city: string): Promise<void> {
    await this.destinationCountryInput.fill(country);
    await this.destinationCityInput.fill(city);
  }

  async clickPublishAsHotLead(): Promise<void> {
    await this.publishButton.click();
  }

  async returnToQuickPost(): Promise<void> {
    await this.page.getByRole('button', { name: 'Post Buying Request' }).click();
  }

  async waitForPublishedRequest(productName: string): Promise<void> {
    await this.publishedRequestHeading(productName).scrollIntoViewIfNeeded();
  }

  checklistItem(text: string): Locator {
    return this.scorePanel.getByText(text, { exact: true });
  }

  selectedOption(text: string): Locator {
    return this.page.getByRole('button', { name: text, exact: true });
  }

  validationMessage(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  budgetInput(index: number): Locator {
    return this.page.locator('input[placeholder="0"]').nth(index);
  }

  get budgetInputs(): Locator {
    return this.page.locator('input[placeholder="0"]');
  }

  formLabel(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }
}
