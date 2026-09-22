// Mirrors AppDeclaracion.Api DTOs field-for-field. Enums serialize as strings
// (global JsonStringEnumConverter on the backend), modeled here as string unions.

export type EstatusDeclaracion = 'Borrador' | 'Calculada';

export const ESTATUS_LABELS: Record<EstatusDeclaracion, string> = {
  Borrador: 'Borrador',
  Calculada: 'Calculada',
};

export type TipoDeduccionPersonal =
  | 'HonorariosMedicosYDentales'
  | 'GastosFunerales'
  | 'Donativos'
  | 'InteresesRealesHipotecarios'
  | 'AportacionesVoluntariasRetiro'
  | 'PrimasSegurosGastosMedicos'
  | 'TransporteEscolarObligatorio'
  | 'Colegiaturas';

export const TIPO_DEDUCCION_PERSONAL_LABELS: Record<TipoDeduccionPersonal, string> = {
  HonorariosMedicosYDentales: 'Honorarios médicos y dentales',
  GastosFunerales: 'Gastos funerales',
  Donativos: 'Donativos',
  InteresesRealesHipotecarios: 'Intereses reales hipotecarios',
  AportacionesVoluntariasRetiro: 'Aportaciones voluntarias al retiro',
  PrimasSegurosGastosMedicos: 'Primas de seguros de gastos médicos',
  TransporteEscolarObligatorio: 'Transporte escolar obligatorio',
  Colegiaturas: 'Colegiaturas',
};

export const TIPOS_DEDUCCION_PERSONAL: TipoDeduccionPersonal[] = Object.keys(
  TIPO_DEDUCCION_PERSONAL_LABELS,
) as TipoDeduccionPersonal[];

export type TipoDeduccionArrendamiento = 'Ciega35Porciento' | 'Real';

export const TIPO_DEDUCCION_ARRENDAMIENTO_LABELS: Record<TipoDeduccionArrendamiento, string> = {
  Ciega35Porciento: 'Deducción ciega (35%)',
  Real: 'Deducciones reales (comprobadas)',
};

export const MESES: { valor: number; nombre: string; abrev: string }[] = [
  { valor: 1, nombre: 'Enero', abrev: 'Ene' },
  { valor: 2, nombre: 'Febrero', abrev: 'Feb' },
  { valor: 3, nombre: 'Marzo', abrev: 'Mar' },
  { valor: 4, nombre: 'Abril', abrev: 'Abr' },
  { valor: 5, nombre: 'Mayo', abrev: 'May' },
  { valor: 6, nombre: 'Junio', abrev: 'Jun' },
  { valor: 7, nombre: 'Julio', abrev: 'Jul' },
  { valor: 8, nombre: 'Agosto', abrev: 'Ago' },
  { valor: 9, nombre: 'Septiembre', abrev: 'Sep' },
  { valor: 10, nombre: 'Octubre', abrev: 'Oct' },
  { valor: 11, nombre: 'Noviembre', abrev: 'Nov' },
  { valor: 12, nombre: 'Diciembre', abrev: 'Dic' },
];

// ---- Requests ----

export interface CrearDeclaracionRequest {
  ejercicio: number;
}

export interface IngresoMensualResicoInput {
  mes: number;
  ingresoCobrado: number;
  retencionIsr: number;
}

export interface EstablecerIngresoResicoRequest {
  meses: IngresoMensualResicoInput[];
}

export interface EstablecerIngresoSueldosRequest {
  ingresoGravado: number;
  isrRetenido: number;
}

export interface DeduccionConceptoInput {
  concepto: string;
  monto: number;
}

export interface EstablecerIngresoActividadEmpresarialRequest {
  ingresosCobrados: number;
  pagosProvisionalesRealizados: number;
  deducciones: DeduccionConceptoInput[];
}

export interface EstablecerIngresoArrendamientoRequest {
  ingresosCobrados: number;
  tipoDeduccion: TipoDeduccionArrendamiento;
  pagosProvisionalesRealizados: number;
  deducciones: DeduccionConceptoInput[];
}

export interface DeduccionPersonalInput {
  tipo: TipoDeduccionPersonal;
  monto: number;
}

export interface EstablecerDeduccionesPersonalesRequest {
  deducciones: DeduccionPersonalInput[];
}

// ---- Responses ----

export interface IngresoResicoDto {
  ingresoAnual: number;
  retencionAnual: number;
  meses: IngresoMensualResicoInput[];
}

export interface IngresoSueldosDto {
  ingresoGravado: number;
  isrRetenido: number;
}

export interface IngresoActividadEmpresarialDto {
  ingresosCobrados: number;
  pagosProvisionalesRealizados: number;
  totalDeducciones: number;
  deducciones: DeduccionConceptoInput[];
}

export interface IngresoArrendamientoDto {
  ingresosCobrados: number;
  tipoDeduccion: TipoDeduccionArrendamiento;
  pagosProvisionalesRealizados: number;
  totalDeduccionesReales: number;
  deducciones: DeduccionConceptoInput[];
}

export interface DeduccionPersonalDto {
  tipo: TipoDeduccionPersonal;
  monto: number;
}

export interface ResultadoCalculoDto {
  isrResicoCausado: number;
  isrResicoRetenido: number;
  saldoResico: number;
  ingresoAcumulableTotal: number;
  deduccionesPersonalesAplicadas: number;
  baseGravableAcumulable: number;
  isrCausadoAcumulable: number;
  pagosAnticipadosAcumulable: number;
  saldoAcumulable: number;
  saldoTotal: number;
  esSaldoAFavor: boolean;
  fechaCalculo: string;
}

export interface DeclaracionResumenDto {
  id: string;
  ejercicio: number;
  estatus: EstatusDeclaracion;
  fechaCreacion: string;
}

export interface DeclaracionDetalleDto {
  id: string;
  ejercicio: number;
  estatus: EstatusDeclaracion;
  fechaCreacion: string;
  ingresoResico: IngresoResicoDto | null;
  ingresoSueldos: IngresoSueldosDto | null;
  ingresoActividadEmpresarial: IngresoActividadEmpresarialDto | null;
  ingresoArrendamiento: IngresoArrendamientoDto | null;
  deduccionesPersonales: DeduccionPersonalDto[];
  resultado: ResultadoCalculoDto | null;
}

/** The 4 independent income régimenes a declaración may combine. */
export type RegimenId = 'resico' | 'sueldos' | 'actividad' | 'arrendamiento';

/** Every step the capture wizard can land on. */
export type WizardStepId = 'regimenes' | RegimenId | 'deducciones' | 'revision';

export const REGIMEN_INFO: Record<RegimenId, { titulo: string; descripcion: string }> = {
  resico: {
    titulo: 'RESICO',
    descripcion: 'Régimen Simplificado de Confianza para personas físicas.',
  },
  sueldos: {
    titulo: 'Sueldos y salarios',
    descripcion: 'Ingresos por nómina, ya retenidos por tu patrón.',
  },
  actividad: {
    titulo: 'Actividad empresarial y profesional',
    descripcion: 'Honorarios u otra actividad empresarial con deducciones propias.',
  },
  arrendamiento: {
    titulo: 'Arrendamiento',
    descripcion: 'Ingresos por renta de inmuebles, con deducción ciega o real.',
  },
};
