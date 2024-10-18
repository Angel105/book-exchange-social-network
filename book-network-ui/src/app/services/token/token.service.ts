import { Injectable } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token() {
    return localStorage.getItem('token') as string;
  }

  isTokenNotValid() {
    return !this.isTokenValid();
  }

  private isTokenValid() {
    const token = this.token;
    if (!token) {
      return false;
    }
    // decode the token
    const jwtHelper = new JwtHelperService();
    // check the expiry date
    const isTokenExpired = jwtHelper.isTokenExpired(token);
    if (isTokenExpired) {
      // localStorage.clear();
      localStorage.removeItem('token');
      return false;
    }
    return true;
  }

  getUsernameFromToken(): string | null {
    const token = this.token;
    if (token) {
      const decodedToken = this.decode(token) as any;
      return decodedToken?.fullName || null;
    }
    return null;
  }

  private decode(token: string) {
    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token);
    // localStorage.setItem('decodedToken', JSON.stringify(decodedToken));
    return decodedToken;
  }

}
