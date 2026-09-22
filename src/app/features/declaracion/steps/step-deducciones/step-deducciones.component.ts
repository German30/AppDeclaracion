import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeclaracionesService } from '../../../../core/declaraciones/declaraciones.service';
import { AppHttpError } from '../../../../core/http/error.interceptor';
import { NotificationService } from '../../../../core/http/notification.service';
import {
  DeduccionPersonalDto,
  TIPOS_DEDUCCION_PERSONAL,
  TIPO_DEDUCCION_PERSONAL_LABELS,
  TipoDeduccionPersonal,
} from '../../../../core/models/declaracion.models';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { MoneyFieldComponent } from '../../../../shared/ui/money-field/money-field.component';
import { SelectFieldComponent, SelectOption } from '../../../../shared/ui/select-field/select-field.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { AlertComponent } from '../../../../shared/ui/alert/alert.component';

// ParametrosFiscales on the backend — hardcoded, non-year-aware. Shown here only as a rough preview;
// the real cap (also bounded by 15% of total income) is computed server-side on /calcular.
const UMA_DIARIA = 108.57;
const DIAS_UMA_ANUAL = 365;
const TOPE_CINCO_UMA = UMA_DIARIA * DIAS_UMA_ANUAL * 5;

@Component({
  selector: 'app-step-deducciones',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, ButtonComponent, MoneyFieldComponent, SelectFieldComponent, IconComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-deducciones.component.html',
  styleUrl: '../step-shared.scss',
})
export class StepDeduccionesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly declaracionesService = inject(DeclaracionesService);
  private readonly notifications = inject(NotificationService);

  readonly declaracionId = input.required<string>();
  readonly initial = input<DeduccionPersonalDto[]>([]);
  readonly ingresoTotalEstimado = input<number>(0);
  readonly guardado = output<DeduccionPersonalDto[]>();
  readonly atras = output<void>();

  readonly guardando = signal(false);
  readonly opcionesTipo: SelectOption[] = TIPOS_DEDUCCION_PERSONAL.map((tipo) => ({
    value: tipo,
    label: TIPO_DEDUCCION_PERSONAL_LABELS[tipo],
  }));

  readonly form = this.fb.group({
    deducciones: this.fb.array<ReturnType<typeof this.crearFila>>([]),
  });

  readonly topeEstimado = computed(() => Math.min(TOPE_CINCO_UMA, this.ingresoTotalEstimado() * 0.15));

  get deducciones(): FormArray {
    return this.form.controls.deducciones;
  }

  get total(): number {
    return this.deducciones.controls.reduce((acc, c) => acc + (Number(c.get('monto')?.value) || 0), 0);
  }

  private crearFila(tipo: TipoDeduccionPersonal | '' = '', monto: number | null = null) {
    return this.fb.group({
      tipo: this.fb.control<TipoDeduccionPersonal | ''>(tipo, [Validators.required]),
      monto: this.fb.control<number | null>(monto, [Validators.required, Validators.min(0)]),
    });
  }

  ngOnInit(): void {
    for (const d of this.initial()) {
      this.deducciones.push(this.crearFila(d.tipo, d.monto));
    }
  }

  agregar(): void {
    this.deducciones.push(this.crearFila());
  }

  quitar(index: number): void {
    this.deducciones.removeAt(index);
  }

  guardar(): void {
    if (this.deducciones.length === 0) {
      this.guardado.emit([]);
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const deducciones = raw.deducciones.map((d) => ({
      tipo: d.tipo as TipoDeduccionPersonal,
      monto: d.monto ?? 0,
    }));

    this.guardando.set(true);
    this.declaracionesService.establecerDeduccionesPersonales(this.declaracionId(), { deducciones }).subscribe({
      next: (dtos) => {
        this.guardando.set(false);
        this.guardado.emit(dtos);
      },
      error: (err: AppHttpError) => {
        this.guardando.set(false);
        this.notifications.error(err.appError?.message ?? 'No se pudieron guardar tus deducciones personales.');
      },
    });
  }
}
