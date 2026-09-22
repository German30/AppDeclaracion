import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Mirrors ASP.NET Identity's default PasswordOptions (only RequiredLength=8 is overridden server-side). */
export function passwordSeguraValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    const errors: ValidationErrors = {};
    if (value.length < 8) errors['minLength'] = true;
    if (!/[0-9]/.test(value)) errors['digit'] = true;
    if (!/[a-z]/.test(value)) errors['lower'] = true;
    if (!/[A-Z]/.test(value)) errors['upper'] = true;
    if (!/[^a-zA-Z0-9]/.test(value)) errors['symbol'] = true;
    return Object.keys(errors).length ? errors : null;
  };
}

/** Backend does not validate RFC format at all — this is a client-side data-quality nudge only. */
export function rfcValidator(): ValidatorFn {
  const pattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = (control.value ?? '').trim();
    if (!value) return null;
    return pattern.test(value) ? null : { rfcFormato: true };
  };
}

export function montoNoNegativoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return Number(value) < 0 ? { negativo: true } : null;
  };
}
