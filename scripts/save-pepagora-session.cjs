const path = require('node:path');
const fs = require('node:fs/promises');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const { chromium } = require('playwright');

const baseUrl =
  process.env.PEPAGORA_URL ||
  'https://www.sandbox.pepagora.org';
const authFile = path.resolve(
  process.env.PEPAGORA_STORAGE_STATE ||
    '.playwright/.auth/pepagora-user.json',
);

async function main() {
  await fs.mkdir(path.dirname(authFile), { recursive: true });

  const browser = await chromium.launch({ headless: false });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${baseUrl}/authenticate?mode=signup`);

    stdout.write(
      'Complete the approved signup or sign-in manually in the opened browser. ' +
        'Enter any phone number and OTP only in that browser, never in this terminal or chat.\n',
    );

    const prompt = readline.createInterface({ input: stdin, output: stdout });
    try {
      await prompt.question(
        'After authentication is complete and you are on an authenticated Pepagora page, press Enter here to save the local browser session. ',
      );
    } finally {
      prompt.close();
    }

    const state = await context.storageState({ path: authFile });
    if (state.cookies.length === 0 && state.origins.every((origin) => origin.localStorage.length === 0)) {
      throw new Error(
        'No browser session data was present. Authentication may not have completed; no usable session was saved.',
      );
    }

    stdout.write(
      `Saved browser session to ${authFile}. Treat this file as a secret; do not share or commit it.\n`,
    );
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
