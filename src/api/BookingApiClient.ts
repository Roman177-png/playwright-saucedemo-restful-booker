import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { AuthCredentials } from './models/AuthToken';
import type {
  Booking,
  BookingIdQuery,
  BookingIdSummary,
  CreateBookingResponse,
} from './models/Booking';

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

/** Thin typed wrapper around the Restful Booker HTTP API. */
export class BookingApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
  ) {}

  /** Exchanges credentials for the auth token required by write operations. */
  async createToken(credentials: AuthCredentials): Promise<AuthResult> {
    const response = await this.request.post(`${this.baseURL}/auth`, {
      headers: JSON_HEADERS,
      data: credentials,
    });
    return { response, token: response.ok() ? (await response.json()).token : undefined };
  }

  async createBooking(booking: Booking): Promise<BookingResult> {
    const response = await this.request.post(`${this.baseURL}/booking`, {
      headers: JSON_HEADERS,
      data: booking,
    });
    return this.toBookingResult(response);
  }

  async getBooking(bookingId: number): Promise<BookingOnlyResult> {
    const response = await this.request.get(`${this.baseURL}/booking/${bookingId}`, {
      headers: JSON_HEADERS,
    });
    const body: Booking | undefined = response.ok() ? await response.json() : undefined;
    return { response, booking: body };
  }

  async getBookingIds(query: BookingIdQuery = {}): Promise<IdsResult> {
    const response = await this.request.get(`${this.baseURL}/booking`, {
      headers: JSON_HEADERS,
      params: query as Record<string, string>,
    });
    const ids: BookingIdSummary[] = response.ok() ? await response.json() : [];
    return { response, ids };
  }

  async updateBooking(
    bookingId: number,
    booking: Booking,
    token: string,
  ): Promise<BookingOnlyResult> {
    const response = await this.request.put(`${this.baseURL}/booking/${bookingId}`, {
      headers: { ...JSON_HEADERS, Cookie: `token=${token}` },
      data: booking,
    });
    const body: Booking | undefined = response.ok() ? await response.json() : undefined;
    return { response, booking: body };
  }

  async partialUpdateBooking(
    bookingId: number,
    patch: Partial<Booking>,
    token: string,
  ): Promise<BookingOnlyResult> {
    const response = await this.request.patch(`${this.baseURL}/booking/${bookingId}`, {
      headers: { ...JSON_HEADERS, Cookie: `token=${token}` },
      data: patch,
    });
    const body: Booking | undefined = response.ok() ? await response.json() : undefined;
    return { response, booking: body };
  }

  async deleteBooking(bookingId: number, token: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}/booking/${bookingId}`, {
      headers: { ...JSON_HEADERS, Cookie: `token=${token}` },
    });
  }

  private async toBookingResult(response: APIResponse): Promise<BookingResult> {
    const body: CreateBookingResponse | undefined = response.ok()
      ? await response.json()
      : undefined;
    return { response, booking: body };
  }
}

interface AuthResult {
  response: APIResponse;
  token: string | undefined;
}

interface BookingResult {
  response: APIResponse;
  booking: CreateBookingResponse | undefined;
}

interface BookingOnlyResult {
  response: APIResponse;
  booking: Booking | undefined;
}

interface IdsResult {
  response: APIResponse;
  ids: BookingIdSummary[];
}
