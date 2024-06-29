import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { StudentService } from './Services/student.service';

import { AgePipe } from './pipes/age.pipe';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchPasswordDirective } from './directives/match-password.directive';
import { AddTokenInterceptor } from './interceptor/add-token.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AddTokenInterceptor])),

    StudentService,
    AgePipe,
   
    DatePipe,
    FormsModule,
    MatchPasswordDirective, provideAnimationsAsync()
  ],
};
