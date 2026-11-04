import { test, expect } from '../../src/fixtures/api.fixtures';
import { BookingBuilder } from '../../src/data/booking.builder';

test.describe('Booking CRUD', () => {
  test('creates a booking and returns the persisted payload @smoke', async ({ apiClient }) => {
    const booking = new BookingBuilder().withFirstname('Alice').withLastname('Walker').build();

    const { response, booking: created } = await apiClient.createBooking(booking);

    expect(response.status()).toBe(200);
    expect(created?.bookingid).toBeGreaterThan(0);
    expect(created?.booking).toMatchObject(booking as unknown as Record<string, unknown>);
  });

  test('reads back a created booking by id @regression', async ({ apiClient }) => {
    const booking = new BookingBuilder().withFirstname('Bob').build();
    const { booking: created } = await apiClient.createBooking(booking);

    const { response, booking: fetched } = await apiClient.getBooking(created!.bookingid);

    expect(response.status()).toBe(200);
    expect(fetched).toMatchObject(booking as unknown as Record<string, unknown>);
  });

  test('fully updates a booking with PUT @regression', async ({ apiClient, authToken }) => {
    const original = new BookingBuilder().withFirstname('Carl').build();
    const { booking: created } = await apiClient.createBooking(original);

    const updated = new BookingBuilder()
      .withFirstname('Carl')
      .withLastname('Updated')
      .withTotalprice(500)
      .build();
    const { response, booking: result } = await apiClient.updateBooking(
      created!.bookingid,
      updated,
      authToken,
    );

    expect(response.status()).toBe(200);
    expect(result).toMatchObject(updated as unknown as Record<string, unknown>);
  });

  test('partially updates a booking with PATCH @regression', async ({ apiClient, authToken }) => {
    const original = new BookingBuilder().withFirstname('Dana').build();
    const { booking: created } = await apiClient.createBooking(original);

    const { response, booking: result } = await apiClient.partialUpdateBooking(
      created!.bookingid,
      { firstname: 'Dana-Patched' },
      authToken,
    );

    expect(response.status()).toBe(200);
    expect(result?.firstname).toBe('Dana-Patched');
    expect(result?.lastname).toBe(original.lastname);
  });

  test('deletes a booking and it is no longer retrievable @regression', async ({
    apiClient,
    authToken,
  }) => {
    const { booking: created } = await apiClient.createBooking(
      new BookingBuilder().withFirstname('Eve').build(),
    );

    const deleteResponse = await apiClient.deleteBooking(created!.bookingid, authToken);
    expect(deleteResponse.status()).toBe(201);

    const { response: getResponse } = await apiClient.getBooking(created!.bookingid);
    expect(getResponse.status()).toBe(404);
  });

  test('created booking id appears in the filtered id listing @regression', async ({
    apiClient,
  }) => {
    const booking = new BookingBuilder()
      .withFirstname('Frank')
      .withLastname('Unique-Search')
      .build();
    const { booking: created } = await apiClient.createBooking(booking);

    const { response, ids } = await apiClient.getBookingIds({
      firstname: 'Frank',
      lastname: 'Unique-Search',
    });

    expect(response.status()).toBe(200);
    expect(ids.map((entry) => entry.bookingid)).toContain(created!.bookingid);
  });
});
