import {  Routes } from '@angular/router';
import { LoginFormComponent } from './Login/login-form/login-form.component';
import { RegisterFormComponent } from './Register/register-form/register-form.component';
import { StudentTableComponent } from './Students/student-table/student-table.component';

export const routes: Routes = [

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginFormComponent },
    { path: 'register', component: RegisterFormComponent },
    { path: 'students', component: StudentTableComponent }
];
