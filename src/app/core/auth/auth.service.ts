import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, JwtClaims, LoginRequest, RegistroRequest, SesionUsuario } from '../models/auth.models';

const STORAGE_KEY = 'declaracion.token';

function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

function sesionDesdeToken(token: string): SesionUsuario | null {
  const claims = decodeJwt(token);
  if (!claims) return null;
  const expiraEn = new Date(claims.exp * 1000);
  if (expiraEn.getTime() <= Date.now()) return null;
  return { usuarioId: claims.sub, email: claims.email, expiraEn };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _sesion = signal<SesionUsuario | null>(this.leerSesionAlmacenada());
  readonly sesion = this._sesion.asReadonly();
  readonly estaAutenticado = computed(() => this._sesion() !== null);

  constructor(private readonly http: HttpClient) {}

  private leerSesionAlmacenada(): SesionUsuario | null {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) return null;
    const sesion = sesionDesdeToken(token);
    if (!sesion) {
      localStorage.removeItem(STORAGE_KEY);
    }
    return sesion;
  }

  get token(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }

  registro(request: RegistroRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/registro`, request)
      .pipe(tap((res) => this.guardarSesion(res.token)));
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((res) => this.guardarSesion(res.token)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._sesion.set(null);
  }

  private guardarSesion(token: string): void {
    localStorage.setItem(STORAGE_KEY, token);
    this._sesion.set(sesionDesdeToken(token));
  }
}
