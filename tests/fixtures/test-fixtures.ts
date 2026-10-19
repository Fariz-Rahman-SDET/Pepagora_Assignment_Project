import { test as base, expect } from '@playwright/test';
import { BuyingRequestActions } from '../../src/actions/buying-request.actions';
import { RegistrationActions } from '../../src/actions/registration.actions';
import { BuyingRequestPage } from '../../src/pages/buying-request.page';
import { RegistrationPage } from '../../src/pages/registration.page';

type TestActions = {
  buyingRequestActions: BuyingRequestActions;
  registrationActions: RegistrationActions;
};

export const test = base.extend<TestActions>({
  buyingRequestActions: async ({ page }, use) => {
    const buyingRequestPage = new BuyingRequestPage(page);
    await use(new BuyingRequestActions(buyingRequestPage));
  },
  registrationActions: async ({ page }, use) => {
    const buyingRequestPage = new BuyingRequestPage(page);
    const registrationPage = new RegistrationPage(page);
    await use(new RegistrationActions(buyingRequestPage, registrationPage));
  },
});

// export { expect };
