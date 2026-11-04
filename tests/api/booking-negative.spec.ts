import { test, expect } from '../../src/fixtures/api.fixtures';
import { BookingBuilder } from '../../src/data/booking.builder';

test.describe('Booking negative paths', () => {
  test('returns 404 for a non-existent booking id @smoke', async ({ apiClient }) => {
    const { response, booking } = await apiClient.getBooking(999_999_999);

    expect(response.status()).toBe(404);
    expect(booking).toBeUndefined();
  });

  test('returns an empty list when no booking matches the filter @regression', async ({
    apiClient,
  }) => {
    const { response, ids } = await apiClient.getBookingIds({
      firstname: 'Nonexistent',
      lastname: `Guest-${Date.now()}`,
    });

    expect(response.status()).toBe(200);
    expect(ids).toEqual([]);
  });

  test('deleting an already-deleted booking is rejected @regression', async ({
    apiClient,
    authToken,
  }) => {
    const { booking: created } = await apiClient.createBooking(new BookingBuilder().build());
    await apiClient.deleteBooking(created!.bookingid, authToken);

    const secondDelete = await apiClient.deleteBooking(created!.bookingid, authToken);

    expect([403, 405]).toContain(secondDelete.status());
  });
});
