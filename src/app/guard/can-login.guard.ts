// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';

// export const CanLoginGuard: CanActivateFn = (route, state) => {
//   let router = inject(Router);
//   const token = localStorage.getItem('token');
//   if (!token) {
//     router.navigateByUrl('/login');
//     return false;
//   } else {
//     return true;
//   }
// };


import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AccountService } from '../Services/core/account.service';

export const CanLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accountService = inject(AccountService);
  const token = localStorage.getItem('token');
  if (!token) {
    router.navigateByUrl('/login');
    return false;
  } else if (accountService.isTokenExpired()) {
    accountService.logout();
    Swal.fire({
      icon: 'warning',
      title: 'Session Expired',
      text: 'Your session has expired. Please log in again.',
    }).then(() => {
      router.navigateByUrl('/login');
    });
    return false;
  } else {
    return true;
  }
};  
