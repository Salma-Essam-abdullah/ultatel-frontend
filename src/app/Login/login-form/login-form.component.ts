
//////////

import { Component } from '@angular/core';
import { AccountService } from '../../Services/core/account.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserLogin } from '../../models/user-login';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../core/header/header.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
imports: [ReactiveFormsModule,CommonModule,HttpClientModule,HeaderComponent,RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  errorMessage: string = '';

  constructor(public accountService: AccountService, public router: Router) {}

  login() {
    if (this.loginForm.valid) {
      const user: UserLogin = new UserLogin(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      );

      this.accountService.login(user).subscribe((result) => {
        if (result) {
          console.log("Login successful");
          this.router.navigate(['/students']);
        } else {
          console.log("Login failed");
          this.errorMessage = 'Invalid credentials. Please try again.'; // Set error message for display
        }
      }, error => {
        console.error('Login error:', error);
        this.errorMessage = 'An error occurred during login. Please try again later.'; // Set error message for display
      });
    } else {
      console.log("Form is not valid");
      this.errorMessage = 'Please fill out all required fields correctly.'; // Set error message for display
    }
  }
}
