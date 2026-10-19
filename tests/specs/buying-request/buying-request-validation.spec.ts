import { test } from '../../fixtures/test-fixtures';
import buyingRequestData from '../../test-data/buying-request.json';

test('BR-NEG-001: empty Quick Post shows required field messages', async ({
  buyingRequestActions,
}) => {
  await buyingRequestActions.verifyEmptyQuickPost(buyingRequestData);
});
