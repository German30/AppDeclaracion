import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearDeclaracionRequest,
  DeclaracionDetalleDto,
  DeclaracionResumenDto,
  DeduccionPersonalDto,
  EstablecerDeduccionesPersonalesRequest,
  EstablecerIngresoActividadEmpresarialRequest,
  EstablecerIngresoArrendamientoRequest,
  EstablecerIngresoResicoRequest,
  EstablecerIngresoSueldosRequest,
  IngresoActividadEmpresarialDto,
  IngresoArrendamientoDto,
  IngresoResicoDto,
  IngresoSueldosDto,
  ResultadoCalculoDto,
} from '../models/declaracion.models';

@Injectable({ providedIn: 'root' })
export class DeclaracionesService {
  private readonly base = `${environment.apiUrl}/declaraciones`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<DeclaracionResumenDto[]> {
    return this.http.get<DeclaracionResumenDto[]>(this.base);
  }

  obtener(id: string): Observable<DeclaracionDetalleDto> {
    return this.http.get<DeclaracionDetalleDto>(`${this.base}/${id}`);
  }

  crear(request: CrearDeclaracionRequest): Observable<DeclaracionResumenDto> {
    return this.http.post<DeclaracionResumenDto>(this.base, request);
  }

  establecerResico(id: string, request: EstablecerIngresoResicoRequest): Observable<IngresoResicoDto> {
    return this.http.put<IngresoResicoDto>(`${this.base}/${id}/ingresos/resico`, request);
  }

  establecerSueldos(id: string, request: EstablecerIngresoSueldosRequest): Observable<IngresoSueldosDto> {
    return this.http.put<IngresoSueldosDto>(`${this.base}/${id}/ingresos/sueldos`, request);
  }

  establecerActividadEmpresarial(
    id: string,
    request: EstablecerIngresoActividadEmpresarialRequest,
  ): Observable<IngresoActividadEmpresarialDto> {
    return this.http.put<IngresoActividadEmpresarialDto>(
      `${this.base}/${id}/ingresos/actividad-empresarial`,
      request,
    );
  }

  establecerArrendamiento(
    id: string,
    request: EstablecerIngresoArrendamientoRequest,
  ): Observable<IngresoArrendamientoDto> {
    return this.http.put<IngresoArrendamientoDto>(`${this.base}/${id}/ingresos/arrendamiento`, request);
  }

  establecerDeduccionesPersonales(
    id: string,
    request: EstablecerDeduccionesPersonalesRequest,
  ): Observable<DeduccionPersonalDto[]> {
    return this.http.put<DeduccionPersonalDto[]>(`${this.base}/${id}/deducciones-personales`, request);
  }

  calcular(id: string): Observable<ResultadoCalculoDto> {
    return this.http.post<ResultadoCalculoDto>(`${this.base}/${id}/calcular`, {});
  }
}
