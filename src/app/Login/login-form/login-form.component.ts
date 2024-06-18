import { Component } from '@angular/core';
import { AccountService } from '../../Services/core/account.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserLogin } from '../../models/user-login';
import { HeaderComponent } from '../../core/header/header.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  standalone: true,
imports: [ReactiveFormsModule,CommonModule,HttpClientModule,HeaderComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

constructor(public accountService:AccountService){
}

login() {
  if (this.loginForm.valid) {
    const user: UserLogin = new UserLogin(
      this.loginForm.get('email')?.value,
      this.loginForm.get('password')?.value
    );

    this.accountService.login(user).subscribe((result) => {
      if (result) {
        console.log("Login successful");
      } else {
        console.log("Login failed");
      }
    });
  } else {
    console.log("Form is not valid");
  }
}
}