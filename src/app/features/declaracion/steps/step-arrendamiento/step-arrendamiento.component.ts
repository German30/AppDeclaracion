import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeclaracionesService } from '../../../../core/declaraciones/declaraciones.service';
import { AppHttpError } from '../../../../core/http/error.interceptor';
import { NotificationService } from '../../../../core/http/notification.service';
import {
  IngresoArrendamientoDto,
  TIPO_DEDUCCION_ARRENDAMIENTO_LABELS,
  TipoDeduccionArrendamiento,
} from '../../../../core/models/declaracion.models';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { MoneyFieldComponent } from '../../../../shared/ui/money-field/money-field.component';
import { TextFieldComponent } from '../../../../shared/ui/text-field/text-field.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { AlertComponent } from '../../../../shared/ui/alert/alert.component';

const PORCENTAJE_DEDUCCION_CIEGA = 0.35;

@Component({
  selector: 'app-step-arrendamiento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    ButtonComponent,
    MoneyFieldComponent,
    TextFieldComponent,
    IconComponent,
    AlertComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-arrendamiento.component.html',
  styleUrl: '../step-shared.scss',
})
export class StepArrendamientoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly declaracionesService = inject(DeclaracionesService);
  private readonly notifications = inject(NotificationService);

  readonly declaracionId = input.required<string>();
  readonly initial = input<IngresoArrendamientoDto | null>(null);
  readonly guardado = output<IngresoArrendamientoDto>();
  readonly atras = output<void>();

  readonly guardando = signal(false);
  readonly opcionesTipo = TIPO_DEDUCCION_ARRENDAMIENTO_LABELS;

  readonly form = this.fb.group({
    ingresosCobrados: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    pagosProvisionalesRealizados: this.fb.control<number | null>(0, [Validators.min(0)]),
    tipoDeduccion: this.fb.control<TipoDeduccionArrendamiento>('Ciega35Porciento', [Validators.required]),
    deducciones: this.fb.array<ReturnType<typeof this.crearDeduccion>>([]),
  });

  private readonly ingresosCobradosValue = toSignal(this.form.controls.ingresosCobrados.valueChanges, {
    initialValue: this.form.controls.ingresosCobrados.value,
  });
  private readonly tipoDeduccionValue = toSignal(this.form.controls.tipoDeduccion.valueChanges, {
    initialValue: this.form.controls.tipoDeduccion.value,
  });

  readonly esReal = computed(() => this.tipoDeduccionValue() === 'Real');

  readonly estimadoDeduccionCiega = computed(() => (this.ingresosCobradosValue() ?? 0) * PORCENTAJE_DEDUCCION_CIEGA);

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
      tipoDeduccion: inicial.tipoDeduccion,
    });
    for (const d of inicial.deducciones) {
      this.deducciones.push(this.crearDeduccion(d.concepto, d.monto));
    }
  }

  seleccionarTipo(tipo: TipoDeduccionArrendamiento): void {
    this.form.controls.tipoDeduccion.setValue(tipo);
  }

  agregarDeduccion(): void {
    this.deducciones.push(this.crearDeduccion());
  }

  quitarDeduccion(index: number): void {
    this.deducciones.removeAt(index);
  }

  guardar(): void {
    if (this.form.controls.ingresosCobrados.invalid || this.form.controls.tipoDeduccion.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.esReal() && this.deducciones.invalid) {
      this.deducciones.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    // Mirrors the backend: itemized deducciones only apply — and are only sent — under "Real".
    const deducciones = raw.tipoDeduccion === 'Real'
      ? raw.deducciones.map((d) => ({ concepto: d.concepto ?? '', monto: d.monto ?? 0 }))
      : [];

    this.guardando.set(true);
    this.declaracionesService
      .establecerArrendamiento(this.declaracionId(), {
        ingresosCobrados: raw.ingresosCobrados ?? 0,
        pagosProvisionalesRealizados: raw.pagosProvisionalesRealizados ?? 0,
        tipoDeduccion: raw.tipoDeduccion ?? 'Ciega35Porciento',
        deducciones,
      })
      .subscribe({
        next: (dto) => {
          this.guardando.set(false);
          this.guardado.emit(dto);
        },
        error: (err: AppHttpError) => {
          this.guardando.set(false);
          this.notifications.error(err.appError?.message ?? 'No se pudieron guardar tus datos de arrendamiento.');
        },
      });
  }
}
