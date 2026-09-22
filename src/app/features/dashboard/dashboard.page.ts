import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DeclaracionesService } from '../../core/declaraciones/declaraciones.service';
import { DeclaracionResumenDto } from '../../core/models/declaracion.models';
import { AppHttpError } from '../../core/http/error.interceptor';
import { NotificationService } from '../../core/http/notification.service';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent, BadgeTone } from '../../shared/ui/badge/badge.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/ui/skeleton/skeleton.component';
import { SelectFieldComponent, SelectOption } from '../../shared/ui/select-field/select-field.component';

const ANIO_MINIMO = 2020;

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    IconComponent,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    EmptyStateComponent,
    SkeletonComponent,
    SelectFieldComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  private readonly declaracionesService = inject(DeclaracionesService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  readonly cargando = signal(true);
  readonly declaraciones = signal<DeclaracionResumenDto[]>([]);
  readonly mostrarFormNueva = signal(false);
  readonly anioSeleccionado = signal('');
  readonly creando = signal(false);

  readonly anioActual = new Date().getFullYear();

  readonly anosDisponibles = computed<SelectOption[]>(() => {
    const usados = new Set(this.declaraciones().map((d) => d.ejercicio));
    const opciones: SelectOption[] = [];
    for (let anio = this.anioActual; anio >= ANIO_MINIMO; anio--) {
      if (!usados.has(anio)) {
        opciones.push({ value: String(anio), label: String(anio) });
      }
    }
    return opciones;
  });

  readonly ordenadas = computed(() =>
    [...this.declaraciones()].sort((a, b) => b.ejercicio - a.ejercicio),
  );

  constructor() {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.declaracionesService.listar().subscribe({
      next: (lista) => {
        this.declaraciones.set(lista);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  toggleFormNueva(): void {
    this.mostrarFormNueva.update((v) => !v);
    if (this.mostrarFormNueva()) {
      const disponible = this.anosDisponibles()[0];
      this.anioSeleccionado.set(disponible ? disponible.value : '');
    }
  }

  crearDeclaracion(): void {
    const ejercicio = Number(this.anioSeleccionado());
    if (!ejercicio) return;

    this.creando.set(true);
    this.declaracionesService.crear({ ejercicio }).subscribe({
      next: (resumen) => {
        this.notifications.exito(`Declaración ${resumen.ejercicio} creada.`);
        this.router.navigate(['/declaraciones', resumen.id]);
      },
      error: (err: AppHttpError) => {
        this.creando.set(false);
        this.notifications.error(err.appError?.message ?? 'No se pudo crear la declaración.');
      },
    });
  }

  estatusTono(estatus: string): BadgeTone {
    return estatus === 'Calculada' ? 'success' : 'neutral';
  }
}
