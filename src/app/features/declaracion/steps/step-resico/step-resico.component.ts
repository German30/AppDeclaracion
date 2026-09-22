import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeclaracionesService } from '../../../../core/declaraciones/declaraciones.service';
import { AppHttpError } from '../../../../core/http/error.interceptor';
import { NotificationService } from '../../../../core/http/notification.service';
import { IngresoResicoDto, MESES } from '../../../../core/models/declaracion.models';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { MoneyFieldComponent } from '../../../../shared/ui/money-field/money-field.component';
import { AlertComponent } from '../../../../shared/ui/alert/alert.component';

@Component({
  selector: 'app-step-resico',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, ButtonComponent, MoneyFieldComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-resico.component.html',
  styleUrls: ['../step-shared.scss', './step-resico.component.scss'],
})
export class StepResicoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly declaracionesService = inject(DeclaracionesService);
  private readonly notifications = inject(NotificationService);

  readonly declaracionId = input.required<string>();
  readonly initial = input<IngresoResicoDto | null>(null);
  readonly guardado = output<IngresoResicoDto>();
  readonly atras = output<void>();

  readonly meses = MESES;
  readonly guardando = signal(false);

  readonly form = this.fb.group({
    meses: this.fb.array(
      MESES.map(() =>
        this.fb.group({
          ingresoCobrado: this.fb.control<number | null>(0, [Validators.min(0)]),
          retencionIsr: this.fb.control<number | null>(0, [Validators.min(0)]),
        }),
      ),
    ),
  });

  get mesesArray(): FormArray {
    return this.form.controls.meses;
  }

  get totalIngreso(): number {
    return this.mesesArray.controls.reduce((acc, c) => acc + (Number(c.get('ingresoCobrado')?.value) || 0), 0);
  }

  get totalRetencion(): number {
    return this.mesesArray.controls.reduce((acc, c) => acc + (Number(c.get('retencionIsr')?.value) || 0), 0);
  }

  ngOnInit(): void {
    const inicial = this.initial();
    if (!inicial) return;
    for (const mes of inicial.meses) {
      const grupo = this.mesesArray.at(mes.mes - 1);
      grupo?.patchValue({ ingresoCobrado: mes.ingresoCobrado, retencionIsr: mes.retencionIsr });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const meses = this.mesesArray.controls.map((c, i) => ({
      mes: i + 1,
      ingresoCobrado: Number(c.get('ingresoCobrado')?.value) || 0,
      retencionIsr: Number(c.get('retencionIsr')?.value) || 0,
    }));

    this.guardando.set(true);
    this.declaracionesService.establecerResico(this.declaracionId(), { meses }).subscribe({
      next: (dto) => {
        this.guardando.set(false);
        this.guardado.emit(dto);
      },
      error: (err: AppHttpError) => {
        this.guardando.set(false);
        this.notifications.error(err.appError?.message ?? 'No se pudieron guardar tus ingresos RESICO.');
      },
    });
  }
}
