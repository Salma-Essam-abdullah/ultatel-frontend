import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../passwordValidator';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../Services/core/account.service';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../core/header/header.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule,HeaderComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {

  registerForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  


  constructor(public accountService:AccountService) {
     
  }

  register() {
      
    console.log(this.registerForm.get('email')?.value,this.registerForm.get('password')?.value)   ;

    this.accountService.register(this.registerForm.get('fullName')?.value,this.registerForm.get('email')?.value, this.registerForm.get('password')?.value ,this.registerForm.get('confirmPassword')?.value).then((success) => {
      if (success) {
        console.log("success")
      } 
    });

    }


 
}
