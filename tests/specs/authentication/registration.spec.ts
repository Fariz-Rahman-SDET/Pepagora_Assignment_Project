import { test } from '../../fixtures/test-fixtures';
import registrationData from '../../test-data/registration.json';

test.describe('Registration', () => {
  test('REG-001: shows signup fields from Join Free', async ({
    registrationActions,
  }) => {
    await registrationActions.verifySignupPage(registrationData);
  });

  test('REG-002: validates an empty mobile number', async ({
    registrationActions,
  }) => {
    await registrationActions.verifyEmptyPhoneValidation(registrationData);
  });

  test('REG-003: rejects malformed mobile input before an OTP request', async ({
    registrationActions,
  }) => {
    await registrationActions.verifyInvalidPhoneDoesNotSendOtp(registrationData);
  });

  test('REG-004: completes signup with a manually entered OTP', async ({
    registrationActions,
  }) => {
    test.setTimeout(0);
    await registrationActions.completeRegistrationWithManualOtp(registrationData);
  });
});
