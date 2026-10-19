import { expect } from '@playwright/test';
import type buyingRequestData from '../../tests/test-data/buying-request.json';
import type { BuyingRequestPage } from '../pages/buying-request.page';

type BuyingRequestData = typeof buyingRequestData;

export class BuyingRequestActions {
  constructor(private readonly page: BuyingRequestPage) {}

  async verifyEmptyQuickPost(data: BuyingRequestData): Promise<void> {
    await this.page.open();
    await this.page.continueToEnrichment();

    await expect(
      this.page.validationMessage(data.expected.basicProductRequired),
    ).toBeVisible();
    await expect(
      this.page.validationMessage(data.expected.basicUnitRequired),
    ).toBeVisible();
  }

  async submitBasicPost(data: BuyingRequestData): Promise<void> {
    await this.page.open();
    const selectedProduct = await this.page.selectProduct(
      data.productName,
      new RegExp(data.productSuggestion, 'i'),
    );
    await this.page.fillQuantity(data.quantity);

    await expect(this.page.productInput).toHaveValue(selectedProduct);
    await expect(this.page.quantityInput).toHaveValue(data.quantity);
    await expect(this.page.unitLabel).toHaveText(data.unit);

    await this.page.basicPostOption.click();
    await expect(this.page.basicPostOption).toHaveClass(
      /pbrNewFlowS1PostCardActive/,
    );
    await this.page.continueToPost();

    await expect(this.page.basicPostConfirmation).toBeVisible({
      timeout: 20_000,
    });
  }

  async verifyIncompleteEnrichment(data: BuyingRequestData): Promise<void> {
    await this.openEnrichment(data);

    await expect(
      this.page.scorePanel.getByText('100', { exact: true }),
    ).not.toBeVisible();
    await expect(
      this.page.checklistItem('Product attributes (0/5 with values)'),
    ).toBeVisible();

    for (const label of [
      'Smart Questions',
      'Logistics & Destination',
      'Required Lead Time',
      'Is this a recurring order?',
      'Destination country',
      'Port / city',
      'Preferred Shipping Terms',
      'Budget & Payment',
      'Payment Terms You Accept',
      'Anything else?',
    ]) {
      await expect(this.page.formLabel(label)).toBeVisible();
    }

    await expect(this.page.budgetInputs).toHaveCount(0);
    await expect(this.page.additionalDetailsInput).toHaveValue('');
  }

  async verifyCompleteEnrichment(data: BuyingRequestData): Promise<void> {
    const selectedProduct = await this.openEnrichment(data);
    const answers = await this.completeEnrichment(data);

    for (const answer of answers.smartAnswers) {
      await expect(this.page.selectedOption(answer)).toBeVisible();
    }
    for (const attribute of answers.customAttributes) {
      await expect(this.page.validationMessage(attribute.name)).toBeVisible();
      await expect(this.page.validationMessage(attribute.value)).toBeVisible();
    }
    for (const selectedValue of [
      data.enrichment.leadTime,
      data.enrichment.recurringOrder,
      data.enrichment.shippingTerm,
      data.enrichment.budgetChoice,
      data.enrichment.paymentTerm,
    ]) {
      await expect(this.page.selectedOption(selectedValue)).toBeVisible();
    }

    await this.verifyEnrichmentChecklist(data);
    await expect(
      this.page.enrichmentSummary(
        `${selectedProduct} - ${data.quantity} ${data.unit}`,
      ),
    ).toBeVisible();
    await expect(this.page.destinationCountryInput).toHaveValue(
      data.enrichment.destinationCountry,
    );
    await expect(this.page.destinationCityInput).toHaveValue(
      data.enrichment.destinationCity,
    );
    await expect(this.page.budgetInput(0)).toHaveValue(data.enrichment.budgetFrom);
    await expect(this.page.budgetInput(1)).toHaveValue(data.enrichment.budgetTo);
    await expect(this.page.currencyDisplay).toContainText(data.enrichment.currency);
    await expect(this.page.additionalDetailsInput).toHaveValue(
      data.enrichment.additionalDetails,
    );
    await expect(this.page.publishButton).toBeVisible();
  }

  async publishEnrichedRequest(data: BuyingRequestData): Promise<void> {
    const selectedProduct = await this.openEnrichment(data);
    await this.completeEnrichment(data);
    await this.verifyEnrichmentChecklist(data);
    await this.page.clickPublishAsHotLead();

    await expect(this.page.publishedAlert).toContainText(
      data.expected.publishedAlert,
      { timeout: 20_000 },
    );
    await expect(this.page.publishedStatus).toHaveText(
      data.expected.publishedStatus,
    );

    await this.page.waitForPublishedRequest(selectedProduct);
    await expect(
      this.page.publishedRequestHeading(selectedProduct),
    ).toContainText(data.quantity);
    await expect(this.page.publishedDetails('INR 10 – 20')).toBeVisible();
    await expect(this.page.publishedDetails('100 Pieces')).toBeVisible();
    await expect(this.page.publishedDetails('Chennai, India')).toBeVisible();
  }

  private async openEnrichment(
    data: BuyingRequestData,
  ): Promise<string> {
    await this.page.open();
    const selectedProduct = await this.page.selectProduct(
      data.productName,
      new RegExp(data.productSuggestion, 'i'),
    );
    await this.page.fillQuantity(data.quantity);
    await this.page.selectEnrichedPost();
    await this.page.continueToEnrichment();
    await expect(this.page.enrichmentHeader).toBeVisible({ timeout: 15_000 });
    return selectedProduct;
  }

  private async completeEnrichment(
    data: BuyingRequestData,
  ): Promise<{
    smartAnswers: string[];
    customAttributes: Array<{ name: string; value: string }>;
  }> {
    const attributeCount = await this.page.smartQuestionBlocks.count();
    const smartAnswers: string[] = [];
    const customAttributes: Array<{ name: string; value: string }> = [];

    for (let index = 0; index < attributeCount; index += 1) {
      const answer = this.page.smartAnswerButton(index);
      smartAnswers.push((await answer.innerText()).trim());
      await answer.click();
    }

    const customAttributesNeeded = Math.max(
      0,
      data.enrichment.minimumAttributes - attributeCount,
    );
    for (let index = 0; index < customAttributesNeeded; index += 1) {
      const name = `${data.enrichment.customAttributePrefix} ${index + 1}`;
      const value = `${data.enrichment.customAttributeValuePrefix} ${index + 1}`;
      await this.page.addCustomAttribute(name, value);
      customAttributes.push({ name, value });
    }

    await this.page.selectOption(data.enrichment.leadTime);
    await this.page.selectOption(data.enrichment.recurringOrder);
    await this.page.selectOption(data.enrichment.shippingTerm);
    await this.page.fillBudgetRange(
      data.enrichment.budgetChoice,
      data.enrichment.budgetFrom,
      data.enrichment.budgetTo,
      data.enrichment.currency,
    );
    await this.page.selectOption(data.enrichment.paymentTerm);
    await this.page.fillDestination(
      data.enrichment.destinationCountry,
      data.enrichment.destinationCity,
    );
    await this.page.additionalDetailsInput.fill(
      data.enrichment.additionalDetails,
    );

    return { smartAnswers, customAttributes };
  }

  private async verifyEnrichmentChecklist(
    data: BuyingRequestData,
  ): Promise<void> {
    await expect(
      this.page.scorePanel.getByText('100', { exact: true }),
    ).toBeVisible({ timeout: 15_000 });

    for (const item of [
      'Product name & category',
      'Quantity & unit',
      `Product attributes (${data.enrichment.minimumAttributes}/${data.enrichment.minimumAttributes} with values)`,
      'Lead time set',
      'Destination & Incoterms',
      'Budget range added',
      'Payment terms selected',
      'Additional details filled in',
    ]) {
      await expect(this.page.checklistItem(item)).toBeVisible();
    }
  }
}
