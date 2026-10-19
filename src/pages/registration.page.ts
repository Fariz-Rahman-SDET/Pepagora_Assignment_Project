import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class RegistrationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get joinFreeLink(): Locator {
    return this.page.getByRole('link', { name: 'Join Free' });
  }

  get signupContinueMessage(): Locator {
    return this.page.getByText('We’ll be sending code to verify your number.');
  }

  get signInHref(): Locator {
    return this.signInLink;
  }

  async blockOtpRequest(onRequest: () => void): Promise<void> {
    await this.page.route('**/auth/sendOtp', async (route) => {
      onRequest();
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Blocked by registration test' }),
      });
    });
  }

  get signInLink(): Locator {
    return this.page.getByRole('link', { name: 'Sign in' });
  }

  get mobileNumberInput(): Locator {
    return this.page.getByPlaceholder('Enter mobile number');
  }

  get continueWithPhoneButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue with Phone' });
  }

  signupHeading(text: string): Locator {
    return this.page.getByRole('heading', { name: text });
  }

  get mobileNumberLabel(): Locator {
    return this.page.getByText('Mobile number', { exact: true });
  }

  get verificationMessage(): Locator {
    return this.page.getByText(
      'We’ll be sending code to verify your number.',
    );
  }

  get googleContinueLabel(): Locator {
    return this.page.getByText('Continue with Google', { exact: true });
  }

  get postBuyingRequestButton(): Locator {
    return this.page.getByRole('button', { name: 'Post Buying Request' });
  }

  get authenticatedAccountButton(): Locator {
    return this.page.getByRole('button', { name: /My account/ });
  }

  validationMessage(message: string): Locator {
    return this.page.getByText(message);
  }

  async fillMobileNumber(phoneNumber: string): Promise<void> {
    await this.mobileNumberInput.fill(phoneNumber);
  }

  async continueWithPhone(): Promise<void> {
    await this.continueWithPhoneButton.click();
  }

  async saveStorageState(filePath: string): Promise<void> {
    await this.page.context().storageState({ path: filePath });
  }
}
