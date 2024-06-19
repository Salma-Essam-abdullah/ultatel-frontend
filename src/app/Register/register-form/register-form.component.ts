import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../Services/core/account.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/header/header.component';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,HeaderComponent,RouterLink]
})
export class RegisterFormComponent {

  registerForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  passwordStrength: string = 'Very Weak';
  criteria = {
    length: false,
    number: false,
    uppercase: false,
    lowercase: false,
    symbol: false,
  };

  errorMessage: string = '';

  constructor(public accountService: AccountService, public router: Router) {
    this.registerForm.get('password')?.valueChanges.subscribe(password => this.checkPasswordStrength(password));
  }

  checkPasswordStrength(password: string) {
    this.criteria.length = password.length >= 8;
    this.criteria.number = /\d/.test(password);
    this.criteria.uppercase = /[A-Z]/.test(password);
    this.criteria.lowercase = /[a-z]/.test(password);
    this.criteria.symbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthCriteria = Object.values(this.criteria).filter(value => value).length;

    switch (strengthCriteria) {
      case 0:
      case 1:
        this.passwordStrength = 'Very Weak';
        break;
      case 2:
        this.passwordStrength = 'Weak';
        break;
      case 3:
        this.passwordStrength = 'Medium';
        break;
      case 4:
      case 5:
        this.passwordStrength = 'Strong';
        break;
    }
  }

  register() {
    if (this.registerForm.valid) {
      const user: User = new User(
        this.registerForm.get('fullName')?.value,
        this.registerForm.get('email')?.value,
        this.registerForm.get('password')?.value,
        this.registerForm.get('confirmPassword')?.value
      );

      this.accountService.register(user).subscribe(
        (result) => {
          console.log("Registration successful");
          this.router.navigate(['/login']);
          
        },
        (error) => {
          console.error("Registration error:", error);
          this.errorMessage = 'Registration failed. Please try again later.';
        }
      );
    } else {
      console.log("Form is not valid");
      
      this.errorMessage = 'Please fill out all required fields correctly.'; 
    }
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.hasError('required')) {
      return 'Field is required';
    } else if (control?.hasError('minlength')) {
      return 'Min length is 3';
    } else if (control?.hasError('email')) {
      return 'Invalid email format';
    } else {
      return '';
    }
  }
}
