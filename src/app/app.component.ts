import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterFormComponent } from './Register/register-form/register-form.component';
import { StudentTableComponent } from './Students/student-table/student-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RegisterFormComponent,StudentTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ultatel';
}
