import { HttpInterceptorFn } from '@angular/common/http';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
  let token = localStorage.getItem('token');
  if (!token) {
    return next(req);
  }

  req = req.clone({
    setHeaders: {
      Authorization: `${token}`,
    },
  });
  return next(req);
};
