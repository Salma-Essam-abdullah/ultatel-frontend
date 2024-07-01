import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../models/user';
import { UserLogin } from '../../models/user-login';
import { AccountResponse } from '../../Dtos/AccountResponse';
import { session } from '../../models/session';
import * as jwtDecode from 'jwt-decode'
import { Router } from '@angular/router';
import { routes } from '../../app.routes';

@Injectable({
  providedIn: 'root',
})

export class AccountService {
  private baseUrl = 'https://ultatelstudents.runasp.net/api/Authentication';
  private token: string | null;
    public claims=new session('','','','');

  
    
    user!: {  Email: string ,IsSuperAdmin:string,UserId:string , UserName:string};
  constructor(private http: HttpClient,private router:Router) {

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
        localStorage.setItem('token', this.token);
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


 
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }


  getClaims(): session {
    let token = localStorage.getItem("token");
    

    if (typeof token === 'string' && token ) {
      this.user = jwtDecode.jwtDecode(token);
      console.log(this.user.IsSuperAdmin);
      this.claims.UserName=this.user.UserName
      this.claims.IsSuperAdmin = this.user.IsSuperAdmin
    }
   
    
    return this.claims;
    
  }



  //login guard 
  isTokenExpired(): boolean {
    
    if (this.token) {
      const decodedToken: any = jwtDecode.jwtDecode(this.token);
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      return expirationDate < new Date();
    }
    return true;
  }
}
