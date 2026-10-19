# Pepagora Playwright QA

Playwright TypeScript end-to-end tests for the Pepagora sandbox buying-request and registration flows.

## Run tests

```powershell
npm ci
npm run test:e2e
```

Run an individual spec:

```powershell
npm run test:e2e -- --grep ENR-POS-001
npm run test:e2e -- --grep BR-NEG-001
npm run test:e2e -- --grep REG-001
```

Run the TypeScript check with `npm run typecheck`.

List all discovered tests with `npx playwright test --list`.

Set `PEPAGORA_URL` to the full buying-request URL to target another environment. Set `PEPAGORA_STORAGE_STATE` to a local Playwright storage-state file when an authenticated session is required. Never commit or share browser state files.

All test cases are enabled. The full test command runs in a headed browser and serially so REG-004 can pause for you to enter the approved mobile number and OTP manually. Resume the test after returning to the buying-request page. E2E-ENR-001 publishes a request to the sandbox.

If you need to create a saved test session, run `npm run auth:setup` and complete the approved authentication in the opened browser.

## Reports and artifacts

The HTML report opens automatically after each test run and is saved in `playwright-report`. To open it later:

```powershell
npm run test:e2e
npm run report:open
```

Playwright traces and run artifacts are written under `test-results\artifacts`. Screenshots are captured only for failed tests and attached to the corresponding Playwright result.

## Framework layout

- `tests/specs`: readable test names and a single call to the related action.
- `tests/fixtures`: page-object/action fixtures.
- `tests/test-data`: non-secret JSON test data.
- `src/pages`: page locators and UI interactions.
- `src/actions`: full test workflows and assertions.
- `src/config`: environment URL and local session configuration.
