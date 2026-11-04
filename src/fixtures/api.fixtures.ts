import { test as base } from '@playwright/test';
import { BookingApiClient } from '../api/BookingApiClient';

interface ApiFixtures {
  apiClient: BookingApiClient;
  authToken: string;
}

// `authToken` is a separate fixture (not folded into apiClient) so tests that
// specifically exercise missing/invalid-auth paths can depend on apiClient alone.
export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    const baseURL = process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com';
    await use(new BookingApiClient(request, baseURL));
  },
  authToken: async ({ apiClient }, use) => {
    const { token } = await apiClient.createToken({
      username: process.env.BOOKER_USERNAME ?? 'admin',
      password: process.env.BOOKER_PASSWORD ?? 'password123',
    });
    if (!token) {
      throw new Error('Failed to obtain Restful Booker auth token for test setup');
    }
    await use(token);
  },
});

export { expect } from '@playwright/test';
