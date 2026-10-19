import { existsSync } from 'node:fs';
import path from 'node:path';

const defaultBuyingRequestUrl =
  'https://www.sandbox.pepagora.org/post-buying-request';
const configuredBuyingRequestUrl =
  process.env.PEPAGORA_URL ?? defaultBuyingRequestUrl;
const parsedBuyingRequestUrl = new URL(configuredBuyingRequestUrl);

export const baseURL = parsedBuyingRequestUrl.origin;
export const buyingRequestPath =
  parsedBuyingRequestUrl.pathname + parsedBuyingRequestUrl.search;
export const signupPath = '/authenticate?mode=signup';
const savedStateCandidates = [
  '.playwright/.auth/pepagora-user.json',
  'storageState.json',
].map((candidate) => path.resolve(candidate));
export const storageStatePath =
  process.env.PEPAGORA_STORAGE_STATE ??
  savedStateCandidates.find((candidate) => existsSync(candidate));
