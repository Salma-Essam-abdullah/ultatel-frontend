import { Component } from '@angular/core';
import { AccountService } from '../../Services/core/account.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatchPasswordDirective } from '../../directives/match-password.directive';
import { AccountResponse } from '../../Dtos/AccountResponse';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatchPasswordDirective,RouterLink]
})
export class RegisterFormComponent {
  form = {
    fullName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  errors: { [key: string]: string } | null = null;

  passwordFieldType: string = 'password';

  confirmPasswordFieldType: string = 'password';

  secretVisibilityType: string = 'password';

  strengthMessage: string = '';
  strengthClass: string = '';
  criteria: any = {
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSymbol: false,
  };
  strengthVisible: boolean = false;


  constructor(private accountService: AccountService, private router: Router) {}

  onSubmit() {
    this.accountService.register(this.form).subscribe((response: AccountResponse) => {
      if (response.isSucceeded) {
        console.log('Registration successful');
        this.errors = null;
        this.router.navigateByUrl('login');
      } else {
        console.error('Registration failed', response.errors);
        this.errors = response.errors;
      }
    });
  }
  onReset(form: NgForm): void {
    form.reset();
  }
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
 
  }
  toggleConfirmPasswordVisibility():void{
    
    
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  evaluateStrength() {
    const password = this.form.password;
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    this.criteria = {
      minLength,
      hasNumber,
      hasUppercase,
      hasLowercase,
      hasSymbol,
    };

    const FilterCriteria = Object.values(this.criteria).filter(Boolean).length;

    if (FilterCriteria === 0 && password.length === 0) {
      this.strengthMessage = '';
      this.strengthClass = '';
    } else if (FilterCriteria <= 2) {
      this.strengthMessage = 'Very Weak';
      this.strengthClass = 'very-weak';
    } else if (FilterCriteria === 3) {
      this.strengthMessage = 'Weak';
      this.strengthClass = 'weak';
    } else if (FilterCriteria === 4) {
      this.strengthMessage = 'Medium';
      this.strengthClass = 'medium';
    } else if (FilterCriteria === 5) {
      this.strengthMessage = 'Strong';
      this.strengthClass = 'strong';
    }
  }

  showStrength() {
    this.strengthVisible = true;
    if (!this.form.password) {
      this.strengthClass = 'very-weak';
      this.strengthMessage = 'Very Weak';
    }
  }

  hideStrength() {
    this.strengthVisible = false;
  }

}