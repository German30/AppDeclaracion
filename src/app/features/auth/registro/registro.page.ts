import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AppHttpError } from '../../../core/http/error.interceptor';
import { AuthService } from '../../../core/auth/auth.service';
import { passwordSeguraValidator, rfcValidator } from '../../../shared/validators/fiscal-validators';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { TextFieldComponent } from '../../../shared/ui/text-field/text-field.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { AlertComponent } from '../../../shared/ui/alert/alert.component';

interface RequisitoPassword {
  clave: 'minLength' | 'upper' | 'lower' | 'digit' | 'symbol';
  texto: string;
}

const REQUISITOS: RequisitoPassword[] = [
  { clave: 'minLength', texto: 'Al menos 8 caracteres' },
  { clave: 'upper', texto: 'Una letra mayúscula' },
  { clave: 'lower', texto: 'Una letra minúscula' },
  { clave: 'digit', texto: 'Un número' },
  { clave: 'symbol', texto: 'Un símbolo (!, @, #, …)' },
];

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IconComponent, TextFieldComponent, ButtonComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registro.page.html',
  styleUrl: '../auth-shared.scss',
})
export class RegistroPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly requisitos = REQUISITOS;

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordSeguraValidator()]],
    rfc: this.fb.control<string>('', [rfcValidator()]),
  });

  private readonly passwordValue = toSignal(this.form.controls.password.valueChanges, {
    initialValue: '',
  });

  readonly passwordErrors = computed(() => {
    // Recompute synchronously from the live value so the checklist updates on every keystroke.
    const control = this.form.controls.password;
    void this.passwordValue();
    return control.errors ?? {};
  });

  campoError(campo: 'nombre' | 'email' | 'rfc'): string | null {
    const control = this.form.controls[campo];
    if (!control.errors) return null;
    if (control.errors['servidor']) return control.errors['servidor'];
    if (campo === 'nombre' && control.errors['required']) return 'Ingresa tu nombre.';
    if (campo === 'email' && (control.errors['required'] || control.errors['email'])) {
      return 'Ingresa un correo válido.';
    }
    if (campo === 'rfc' && control.errors['rfcFormato']) {
      return 'Ese RFC no tiene un formato reconocible (13 caracteres para personas físicas).';
    }
    return null;
  }

  submit(): void {
    const camposClave = [this.form.controls.nombre, this.form.controls.email, this.form.controls.password];
    if (camposClave.some((c) => c.invalid)) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    this.authService
      .registro({
        nombre: raw.nombre,
        email: raw.email,
        password: raw.password,
        rfc: raw.rfc?.trim() ? raw.rfc.trim().toUpperCase() : null,
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (err: AppHttpError) => {
          this.loading.set(false);
          const fieldErrors = err.appError?.fieldErrors;
          if (fieldErrors) {
            for (const [field, mensajes] of Object.entries(fieldErrors)) {
              const control = this.form.get(field);
              if (control) {
                control.setErrors({ servidor: mensajes[0] });
                control.markAsTouched();
              }
            }
          }
          this.errorMessage.set(err.appError?.message ?? 'No se pudo crear tu cuenta.');
        },
      });
  }
}
