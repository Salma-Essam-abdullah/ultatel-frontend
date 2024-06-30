import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../models/user';
import { UserLogin } from '../../models/user-login';
import { AccountResponse } from '../../Dtos/AccountResponse';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = 'http://localhost:5017/api/authentication';
  private token: string | null;

 
  constructor(private http: HttpClient) {

    this.token = null;
  }
  
  register(user: User): Observable<AccountResponse> {
    const url = `${this.baseUrl}/Register`;
    return this.http.post<AccountResponse>(url, user).pipe(
      catchError((error) => {
        const accountResponse: AccountResponse = {
          message: error.error.message || 'ValidationError',
          isSucceeded: false,
          errors: error.error.errors || null,
          
        };
        return of(accountResponse);
      })  
    );
  }
  login(user: UserLogin): Observable<AccountResponse> {
    const url = `${this.baseUrl}/Login`;
    return this.http.post<AccountResponse>(url, user).pipe(
      map((response: AccountResponse) => {
        this.token = response.message;
        return {
          message: response.message,
          isSucceeded: true,
          errors: null
        };
      }),
      catchError((error) => {
        const accountResponse: AccountResponse = {
          message: error.error.message || 'Validation Error',
          isSucceeded: false,
          errors: error.error.errors || null
        };
        return of(accountResponse);
      })
    );
  }

  getToken(){
    return this.token;
  }
 
  logout(): void {
    localStorage.removeItem('token');
  }
}
