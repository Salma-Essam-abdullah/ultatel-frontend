import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterFormComponent } from './Register/register-form/register-form.component';
import { StudentTableComponent } from './Students/student-table/student-table.component';
import { LoginFormComponent } from './Login/login-form/login-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RegisterFormComponent,StudentTableComponent,LoginFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ultatel';
}
