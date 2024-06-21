import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { StudentService } from './Services/student.service';

import { AgePipe } from './pipes/age.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePipe, DecimalPipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    StudentService,
    AgePipe,
    NgSelectModule,
    DecimalPipe,
    DatePipe,
  ],
};
