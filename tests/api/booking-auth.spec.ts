import { test, expect } from '../../src/fixtures/api.fixtures';
import { BookingBuilder } from '../../src/data/booking.builder';

test.describe('Booking authorization', () => {
  test('issues a valid token for correct credentials @smoke', async ({ apiClient }) => {
    const { response, token } = await apiClient.createToken({
      username: process.env.BOOKER_USERNAME ?? 'admin',
      password: process.env.BOOKER_PASSWORD ?? 'password123',
    });

    expect(response.status()).toBe(200);
    expect(token).toMatch(/^[a-f0-9]+$/);
  });

  test('rejects token creation with wrong credentials @regression', async ({ apiClient }) => {
    const { response, token } = await apiClient.createToken({
      username: 'admin',
      password: 'not-the-password',
    });

    expect(response.status()).toBe(200);
    expect(token).toBeUndefined();
  });

  test('rejects updating a booking without a token @regression', async ({ apiClient }) => {
    const { booking: created } = await apiClient.createBooking(new BookingBuilder().build());

    const { response } = await apiClient.updateBooking(
      created!.bookingid,
      new BookingBuilder().build(),
      'invalid-token',
    );

    expect(response.status()).toBe(403);
  });

  test('rejects deleting a booking without a token @regression', async ({ apiClient }) => {
    const { booking: created } = await apiClient.createBooking(new BookingBuilder().build());

    const response = await apiClient.deleteBooking(created!.bookingid, 'invalid-token');

    expect(response.status()).toBe(403);
  });
});
