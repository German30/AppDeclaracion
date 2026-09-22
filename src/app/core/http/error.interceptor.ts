import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AppError, traducirErroresIdentity } from './error.model';
import { NotificationService } from './notification.service';

export interface AppHttpError extends HttpErrorResponse {
  appError: AppError;
}

function construirAppError(err: HttpErrorResponse, esIntentoLogin: boolean): AppError {
  if (err.status === 0) {
    return {
      status: 0,
      message: 'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.',
    };
  }

  if (err.status === 401) {
    return {
      status: 401,
      message: esIntentoLogin
        ? 'Correo o contraseña incorrectos.'
        : 'Tu sesión expiró. Vuelve a iniciar sesión.',
    };
  }

  if (err.status === 400 && err.error?.errors) {
    return {
      status: 400,
      message: 'Revisa los datos marcados.',
      fieldErrors: traducirErroresIdentity(err.error.errors),
    };
  }

  if (err.status === 404 && typeof err.error?.error === 'string') {
    return { status: 404, message: err.error.error };
  }

  return {
    status: err.status,
    message: 'Ocurrió un error inesperado al procesar tu solicitud. Verifica los datos capturados e inténtalo de nuevo.',
  };
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const esIntentoLogin = req.url.includes('/auth/login');
  const esIntentoRegistro = req.url.includes('/auth/registro');

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const appError = construirAppError(err, esIntentoLogin);
      const httpError = err as AppHttpError;
      httpError.appError = appError;

      const esErrorDeAuth = esIntentoLogin || esIntentoRegistro;

      if (err.status === 401 && !esErrorDeAuth) {
        authService.logout();
        router.navigate(['/login'], { queryParams: { sesionExpirada: 1 } });
      } else if (err.status === 0 || err.status >= 500) {
        // Unexpected failures have no dedicated inline UI anywhere — surface a toast.
        notifications.error(appError.message);
      }

      return throwError(() => httpError);
    }),
  );
};
