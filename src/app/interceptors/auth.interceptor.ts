import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/signup')
  ) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  // Attach token only if it exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
