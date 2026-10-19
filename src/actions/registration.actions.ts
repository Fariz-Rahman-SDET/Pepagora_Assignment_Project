import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect } from '@playwright/test';
import type registrationData from '../../tests/test-data/registration.json';
import { buyingRequestPath, signupPath, storageStatePath } from '../config/env';
import type { BuyingRequestPage } from '../pages/buying-request.page';
import type { RegistrationPage } from '../pages/registration.page';

type RegistrationData = typeof registrationData;

export class RegistrationActions {
  constructor(
    private readonly buyingRequestPage: BuyingRequestPage,
    private readonly page: RegistrationPage,
  ) {}

  async verifySignupPage(data: RegistrationData): Promise<void> {
    await this.buyingRequestPage.open();
    await this.page.joinFreeLink.click();

    await expect(this.page.signupHeading(data.expected.signupHeading)).toBeVisible();
    await expect(this.page.mobileNumberLabel).toBeVisible();
    await expect(this.page.mobileNumberInput).toHaveAttribute('type', 'tel');
    await expect(this.page.signupContinueMessage).toBeVisible();
    await expect(this.page.continueWithPhoneButton).toBeVisible();
    await expect(this.page.googleContinueLabel).toBeVisible();
    await expect(this.page.signInLink).toHaveAttribute(
      'href',
      '/authenticate?mode=login',
    );
  }

  async verifyEmptyPhoneValidation(data: RegistrationData): Promise<void> {
    await this.page.navigateTo(signupPath);
    await this.page.continueWithPhone();
    await expect(
      this.page.validationMessage(data.expected.invalidMobileMessage),
    ).toBeVisible();
    await expect.poll(() => this.page.url).toMatch(/\/authenticate\?mode=signup/);
  }

  async verifyInvalidPhoneDoesNotSendOtp(
    data: RegistrationData,
  ): Promise<void> {
    let otpRequestSent = false;
    await this.page.blockOtpRequest(() => {
      otpRequestSent = true;
    });
    await this.page.navigateTo(signupPath);
    await this.page.fillMobileNumber(data.invalidMobileNumber);
    await this.page.continueWithPhone();

    await expect(
      this.page.validationMessage(data.expected.invalidMobileMessage),
    ).toBeVisible();
    await expect.poll(() => this.page.url).toMatch(/\/authenticate\?mode=signup/);
    expect(otpRequestSent).toBe(false);
  }

  async completeRegistrationWithManualOtp(
    data: RegistrationData,
  ): Promise<void> {
    await this.buyingRequestPage.open();
    await this.page.joinFreeLink.click();
    await expect(this.page.signupHeading(data.expected.signupHeading)).toBeVisible();

    await this.page.pauseForManualInput();
    await expect(this.page.authenticatedAccountButton).toBeVisible({
      timeout: 120_000,
    });
    await this.buyingRequestPage.returnToQuickPost();

    const expectedUrl = new URL(buyingRequestPath, this.page.url).href;
    await expect.poll(() => this.page.url).toBe(expectedUrl);

    const stateFile =
      storageStatePath ?? path.resolve('.playwright/.auth/pepagora-user.json');
    await mkdir(path.dirname(stateFile), { recursive: true });
    await this.page.saveStorageState(stateFile);
  }
}
