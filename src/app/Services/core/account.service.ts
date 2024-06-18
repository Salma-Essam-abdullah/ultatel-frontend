import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {


  private baseUrl="http://localhost:5017/api/authentication"

  constructor(public http:HttpClient) { }
  register(   fullname:string,
     email: string,
     password: string,
     confirmPassword:string): Promise<boolean> {
    let str: string = `/Register`;
    return new Promise<boolean>((resolve) => {
      this.http.post(this.baseUrl + str, { fullname, email, password , confirmPassword }, { responseType: 'text' }).subscribe(
        (response) => {
          console.log(response);
          resolve(true);
        },
        (error) => {
          console.log("Error occurred during registration:", error.error);
          resolve(false); 
        }
      );
    });
  }
   
}
