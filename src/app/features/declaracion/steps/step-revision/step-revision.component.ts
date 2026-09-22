import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { DeclaracionesService } from '../../../../core/declaraciones/declaraciones.service';
import { AppHttpError } from '../../../../core/http/error.interceptor';
import { NotificationService } from '../../../../core/http/notification.service';
import {
  DeclaracionDetalleDto,
  REGIMEN_INFO,
  ResultadoCalculoDto,
  TIPO_DEDUCCION_ARRENDAMIENTO_LABELS,
  TIPO_DEDUCCION_PERSONAL_LABELS,
  WizardStepId,
} from '../../../../core/models/declaracion.models';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { AlertComponent } from '../../../../shared/ui/alert/alert.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-step-revision',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, ButtonComponent, AlertComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-revision.component.html',
  styleUrls: ['../step-shared.scss', './step-revision.component.scss'],
})
export class StepRevisionComponent {
  private readonly declaracionesService = inject(DeclaracionesService);
  private readonly notifications = inject(NotificationService);

  readonly declaracionId = input.required<string>();
  readonly detalle = input.required<DeclaracionDetalleDto>();
  readonly resultado = input<ResultadoCalculoDto | null>(null);
  readonly desactualizado = input(false);
  readonly editarPaso = output<WizardStepId>();
  readonly calculado = output<ResultadoCalculoDto>();
  readonly atras = output<void>();

  readonly calculando = signal(false);
  readonly info = REGIMEN_INFO;
  readonly labelDeduccionPersonal = TIPO_DEDUCCION_PERSONAL_LABELS;
  readonly labelTipoArrendamiento = TIPO_DEDUCCION_ARRENDAMIENTO_LABELS;

  calcular(): void {
    this.calculando.set(true);
    this.declaracionesService.calcular(this.declaracionId()).subscribe({
      next: (resultado) => {
        this.calculando.set(false);
        this.calculado.emit(resultado);
      },
      error: (err: AppHttpError) => {
        this.calculando.set(false);
        this.notifications.error(err.appError?.message ?? 'No se pudo calcular tu declaración.');
      },
    });
  }
}
