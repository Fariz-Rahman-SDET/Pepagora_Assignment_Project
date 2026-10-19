import { test } from '../../fixtures/test-fixtures';
import buyingRequestData from '../../test-data/buying-request.json';
import { storageStatePath } from '../../../src/config/env';

test.use({ storageState: storageStatePath });

test('BR-POS-001: submits a basic buying request and verifies confirmation', async ({
  buyingRequestActions,}) => {
  await buyingRequestActions.submitBasicPost(buyingRequestData);
});git config --global user.name

test.describe('Buying request enrichment', () => {
  test('ENR-NEG-001: incomplete enrichment remains below 100', async ({
    buyingRequestActions,}) => {
    await buyingRequestActions.verifyIncompleteEnrichment(buyingRequestData);
  });

  test('ENR-POS-001: completes enrichment and verifies every field', async ({
    buyingRequestActions,}) => {
    await buyingRequestActions.verifyCompleteEnrichment(buyingRequestData);
  });

  test('E2E-ENR-001: publishes an enriched request and checks confirmation', async ({
    buyingRequestActions,}) => {
    await buyingRequestActions.publishEnrichedRequest(buyingRequestData);
  });
});
