export interface AppError {
  status: number;
  message: string;
  /** Field-level messages keyed by form field name, translated from Identity error codes. */
  fieldErrors?: Record<string, string[]>;
}

/** ASP.NET Identity error codes → Spanish, and the form field they belong to. */
const IDENTITY_ERROR_MAP: Record<string, { field: 'email' | 'password' | 'nombre'; texto: string }> = {
  DuplicateUserName: { field: 'email', texto: 'Ya existe una cuenta con este correo.' },
  DuplicateEmail: { field: 'email', texto: 'Ya existe una cuenta con este correo.' },
  InvalidEmail: { field: 'email', texto: 'El correo no tiene un formato válido.' },
  InvalidUserName: { field: 'email', texto: 'El correo no tiene un formato válido.' },
  PasswordTooShort: { field: 'password', texto: 'La contraseña debe tener al menos 8 caracteres.' },
  PasswordRequiresDigit: { field: 'password', texto: 'La contraseña debe incluir al menos un número.' },
  PasswordRequiresLower: {
    field: 'password',
    texto: 'La contraseña debe incluir al menos una minúscula.',
  },
  PasswordRequiresUpper: {
    field: 'password',
    texto: 'La contraseña debe incluir al menos una mayúscula.',
  },
  PasswordRequiresNonAlphanumeric: {
    field: 'password',
    texto: 'La contraseña debe incluir al menos un símbolo (ej. !, @, #).',
  },
  PasswordRequiresUniqueChars: {
    field: 'password',
    texto: 'La contraseña necesita más caracteres distintos entre sí.',
  },
};

export function traducirErroresIdentity(errors: Record<string, string[]>): AppError['fieldErrors'] {
  const traducido: Record<string, string[]> = {};
  for (const [code, mensajes] of Object.entries(errors)) {
    const mapping = IDENTITY_ERROR_MAP[code];
    const field = mapping?.field ?? 'email';
    const texto = mapping?.texto ?? mensajes[0] ?? 'Dato inválido.';
    (traducido[field] ??= []).push(texto);
  }
  return traducido;
}
