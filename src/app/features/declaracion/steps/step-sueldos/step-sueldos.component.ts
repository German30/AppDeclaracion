import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeclaracionesService } from '../../../../core/declaraciones/declaraciones.service';
import { AppHttpError } from '../../../../core/http/error.interceptor';
import { NotificationService } from '../../../../core/http/notification.service';
import { IngresoSueldosDto } from '../../../../core/models/declaracion.models';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { MoneyFieldComponent } from '../../../../shared/ui/money-field/money-field.component';

@Component({
  selector: 'app-step-sueldos',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, MoneyFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-sueldos.component.html',
  styleUrl: '../step-shared.scss',
})
export class StepSueldosComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly declaracionesService = inject(DeclaracionesService);
  private readonly notifications = inject(NotificationService);

  readonly declaracionId = input.required<string>();
  readonly initial = input<IngresoSueldosDto | null>(null);
  readonly guardado = output<IngresoSueldosDto>();
  readonly atras = output<void>();

  readonly guardando = signal(false);

  readonly form = this.fb.group({
    ingresoGravado: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    isrRetenido: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  ngOnInit(): void {
    const inicial = this.initial();
    if (inicial) this.form.patchValue(inicial);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.declaracionesService
      .establecerSueldos(this.declaracionId(), {
        ingresoGravado: this.form.controls.ingresoGravado.value ?? 0,
        isrRetenido: this.form.controls.isrRetenido.value ?? 0,
      })
      .subscribe({
        next: (dto) => {
          this.guardando.set(false);
          this.guardado.emit(dto);
        },
        error: (err: AppHttpError) => {
          this.guardando.set(false);
          this.notifications.error(err.appError?.message ?? 'No se pudieron guardar tus datos de sueldos.');
        },
      });
  }
}
