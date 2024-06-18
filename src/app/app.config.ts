import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {  provideHttpClient } from '@angular/common/http';
import { StudentService } from './Services/student.service';
import { DecimalPipe } from '@angular/common';
import { AgePipe } from './pipes/age.pipe';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),StudentService, DecimalPipe,AgePipe]
  
};
