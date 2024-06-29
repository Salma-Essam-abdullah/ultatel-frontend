import { HttpInterceptorFn } from "@angular/common/http";


export const AddTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = `Bearer ${localStorage.getItem("token")}`;

  let request = req.clone({
    setHeaders: {
      Authorization: token
    }
  })
  return next(request);
};