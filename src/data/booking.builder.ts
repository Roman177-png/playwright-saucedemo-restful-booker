import type { Booking } from '../api/models/Booking';

/** Fluent builder for {@link Booking} payloads so tests never hand-roll literals. */
export class BookingBuilder {
  private booking: Booking = {
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-01-01',
      checkout: '2026-01-05',
    },
    additionalneeds: 'Breakfast',
  };

  withFirstname(firstname: string): this {
    this.booking.firstname = firstname;
    return this;
  }

  withLastname(lastname: string): this {
    this.booking.lastname = lastname;
    return this;
  }

  withTotalprice(totalprice: number): this {
    this.booking.totalprice = totalprice;
    return this;
  }

  withDepositpaid(depositpaid: boolean): this {
    this.booking.depositpaid = depositpaid;
    return this;
  }

  withDates(checkin: string, checkout: string): this {
    this.booking.bookingdates = { checkin, checkout };
    return this;
  }

  withAdditionalneeds(additionalneeds: string | undefined): this {
    this.booking.additionalneeds = additionalneeds;
    return this;
  }

  build(): Booking {
    return { ...this.booking, bookingdates: { ...this.booking.bookingdates } };
  }
}

/** Unique-ish suffix so parallel workers don't collide on booking search queries. */
export function uniqueSuffix(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}
