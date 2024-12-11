import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'jwt_token';

  constructor(private cookieService: CookieService) {}

  setToken(token: string): void {
    this.cookieService.set(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.cookieService.get(this.TOKEN_KEY) || null;
  }

  clearToken(): void {
    this.cookieService.delete(this.TOKEN_KEY);
  }
}
