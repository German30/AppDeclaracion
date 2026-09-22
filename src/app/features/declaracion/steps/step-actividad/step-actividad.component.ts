import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeclaracionesService } from '../../../../core/declaraciones/declaraciones.service';
import { AppHttpError } from '../../../../core/http/error.interceptor';
import { NotificationService } from '../../../../core/http/notification.service';
import { IngresoActividadEmpresarialDto } from '../../../../core/models/declaracion.models';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { MoneyFieldComponent } from '../../../../shared/ui/money-field/money-field.component';
import { TextFieldComponent } from '../../../../shared/ui/text-field/text-field.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-step-actividad',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, ButtonComponent, MoneyFieldComponent, TextFieldComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-actividad.component.html',
  styleUrl: '../step-shared.scss',
})
export class StepActividadComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly declaracionesService = inject(DeclaracionesService);
  private readonly notifications = inject(NotificationService);

  readonly declaracionId = input.required<string>();
  readonly initial = input<IngresoActividadEmpresarialDto | null>(null);
  readonly guardado = output<IngresoActividadEmpresarialDto>();
  readonly atras = output<void>();

  readonly guardando = signal(false);

  readonly form = this.fb.group({
    ingresosCobrados: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    pagosProvisionalesRealizados: this.fb.control<number | null>(0, [Validators.min(0)]),
    deducciones: this.fb.array<ReturnType<typeof this.crearDeduccion>>([]),
  });

  get deducciones(): FormArray {
    return this.form.controls.deducciones;
  }

  get totalDeducciones(): number {
    return this.deducciones.controls.reduce((acc, c) => acc + (Number(c.get('monto')?.value) || 0), 0);
  }

  private crearDeduccion(concepto = '', monto: number | null = null) {
    return this.fb.group({
      concepto: this.fb.control(concepto, [Validators.required, Validators.maxLength(200)]),
      monto: this.fb.control<number | null>(monto, [Validators.required, Validators.min(0)]),
    });
  }

  ngOnInit(): void {
    const inicial = this.initial();
    if (!inicial) return;
    this.form.patchValue({
      ingresosCobrados: inicial.ingresosCobrados,
      pagosProvisionalesRealizados: inicial.pagosProvisionalesRealizados,
    });
    for (const d of inicial.deducciones) {
      this.deducciones.push(this.crearDeduccion(d.concepto, d.monto));
    }
  }

  agregarDeduccion(): void {
    this.deducciones.push(this.crearDeduccion());
  }

  quitarDeduccion(index: number): void {
    this.deducciones.removeAt(index);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.guardando.set(true);
    this.declaracionesService
      .establecerActividadEmpresarial(this.declaracionId(), {
        ingresosCobrados: raw.ingresosCobrados ?? 0,
        pagosProvisionalesRealizados: raw.pagosProvisionalesRealizados ?? 0,
        deducciones: raw.deducciones.map((d) => ({ concepto: d.concepto ?? '', monto: d.monto ?? 0 })),
      })
      .subscribe({
        next: (dto) => {
          this.guardando.set(false);
          this.guardado.emit(dto);
        },
        error: (err: AppHttpError) => {
          this.guardando.set(false);
          this.notifications.error(err.appError?.message ?? 'No se pudieron guardar tus datos de actividad empresarial.');
        },
      });
  }
}
