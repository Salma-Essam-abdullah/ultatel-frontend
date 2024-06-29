//////////
import { Component } from '@angular/core';
import { AccountService } from '../../Services/core/account.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatchPasswordDirective } from '../../directives/match-password.directive';
import { AccountResponse } from '../../Dtos/AccountResponse';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, CommonModule, MatchPasswordDirective,RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {

    form = {
      email: '',
      password: ''
    };
  
    errors: { [key: string]: string } | null = null;
    passwordFieldType: string = 'password';
  
    constructor(private accountService: AccountService, private router: Router) {}
  
    onSubmit() {
      this.accountService.login(this.form).subscribe((response: AccountResponse) => {
        if (response.isSucceeded) {
          console.log('Login successful');
          this.errors = null;
          localStorage.setItem("token",response.message);
          this.router.navigateByUrl('students');
        } else {
          console.error('Login failed', response.errors);
          this.errors = response.errors;
        }
      });
    }
  
    togglePasswordVisibility(): void {
  this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    }



}
