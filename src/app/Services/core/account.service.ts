import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { session } from '../../models/session';
import { jwtDecode } from "jwt-decode";
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../models/user';
import { UserLogin } from '../../models/user-login';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = "http://localhost:5017/api/authentication";
  public claims = new session(false, "", "", "", "");

  user!: { isAuthenticated: boolean; Name: string; Email: string; IsAdmin: string; UserId: string; };
  constructor(private http: HttpClient) {}

  register(user: User): Observable<boolean> {
    const url = `${this.baseUrl}/Register`;
    return this.http.post(url, {
      fullname: user.fullName,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword
    }, { responseType: 'text' }).pipe(
      map((response) => {
        console.log(response);
        return true;
      }),
      catchError((error) => {
        console.log("Error occurred during registration:", error.error);
        return of(false);
      })
    );
  }

  login(user: UserLogin): Observable<any> {
    const url = `${this.baseUrl}/Login`;
    return this.http.post<any>(url, { email: user.email, password: user.password }).pipe(
      map((response) => {
        const token = response.message;  
        localStorage.setItem("token", token);
        return response;  
      }),
      catchError((error) => {
        console.error("Error occurred during login:", error);
        return of(null); 
      })
    );
  }
  
  getClaims(): session {
    const token = localStorage.getItem("token");
    if (typeof token === 'string' && token) {
      try {
        const decodedToken: any = jwtDecode(token);

        this.claims.isAuthenticated = true;
        this.claims.Name = decodedToken.UserName;
        this.claims.Email = decodedToken.Email;
        this.claims.isAdmin = decodedToken.IsAdmin;
        this.claims.UserId = decodedToken.UserId;
      } catch (error) {
        console.error('Error decoding token', error);
      }
    }
    return this.claims;
  }

  logout(): void {
    localStorage.removeItem("token");
    this.claims.isAuthenticated = false;
  }
}
