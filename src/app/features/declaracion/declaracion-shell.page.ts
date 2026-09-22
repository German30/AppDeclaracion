import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeclaracionesService } from '../../core/declaraciones/declaraciones.service';
import { NotificationService } from '../../core/http/notification.service';
import {
  DeclaracionDetalleDto,
  DeduccionPersonalDto,
  IngresoActividadEmpresarialDto,
  IngresoArrendamientoDto,
  IngresoResicoDto,
  IngresoSueldosDto,
  REGIMEN_INFO,
  RegimenId,
  ResultadoCalculoDto,
  WizardStepId,
} from '../../core/models/declaracion.models';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { SkeletonComponent } from '../../shared/ui/skeleton/skeleton.component';
import { StepInfo, StepperNavComponent } from '../../shared/ui/stepper-nav/stepper-nav.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { StepRegimenesComponent } from './steps/step-regimenes/step-regimenes.component';
import { StepResicoComponent } from './steps/step-resico/step-resico.component';
import { StepSueldosComponent } from './steps/step-sueldos/step-sueldos.component';
import { StepActividadComponent } from './steps/step-actividad/step-actividad.component';
import { StepArrendamientoComponent } from './steps/step-arrendamiento/step-arrendamiento.component';
import { StepDeduccionesComponent } from './steps/step-deducciones/step-deducciones.component';
import { StepRevisionComponent } from './steps/step-revision/step-revision.component';

const ORDEN_REGIMENES: RegimenId[] = ['resico', 'sueldos', 'actividad', 'arrendamiento'];

type StepId = WizardStepId;

@Component({
  selector: 'app-declaracion-shell-page',
  standalone: true,
  imports: [
    RouterLink,
    IconComponent,
    SkeletonComponent,
    StepperNavComponent,
    BadgeComponent,
    StepRegimenesComponent,
    StepResicoComponent,
    StepSueldosComponent,
    StepActividadComponent,
    StepArrendamientoComponent,
    StepDeduccionesComponent,
    StepRevisionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './declaracion-shell.page.html',
  styleUrl: './declaracion-shell.page.scss',
})
export class DeclaracionShellPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly declaracionesService = inject(DeclaracionesService);
  private readonly notifications = inject(NotificationService);

  readonly declaracionId = this.route.snapshot.paramMap.get('id')!;

  readonly cargando = signal(true);
  readonly detalle = signal<DeclaracionDetalleDto | null>(null);
  readonly regimenes = signal<Set<RegimenId>>(new Set());
  readonly regimenesConfirmados = signal(false);
  readonly stepIndex = signal(0);
  readonly pasosGuardados = signal<Set<string>>(new Set());
  readonly resultado = signal<ResultadoCalculoDto | null>(null);
  readonly desactualizado = signal(false);

  readonly ordenRegimenes = computed<RegimenId[]>(() =>
    ORDEN_REGIMENES.filter((r) => this.regimenes().has(r)),
  );

  readonly stepIds = computed<StepId[]>(() => [
    'regimenes',
    ...this.ordenRegimenes(),
    'deducciones',
    'revision',
  ]);

  readonly currentStepId = computed<StepId>(() => this.stepIds()[this.stepIndex()] ?? 'regimenes');

  readonly stepperItems = computed<StepInfo[]>(() => {
    const ids = this.stepIds();
    const current = this.stepIndex();
    const guardados = this.pasosGuardados();
    return ids.map((id, i) => {
      const label = id === 'regimenes' ? 'Régimen' : id === 'deducciones' ? 'Deducciones' : id === 'revision' ? 'Revisión y cálculo' : REGIMEN_INFO[id as RegimenId].titulo;
      let status: StepInfo['status'];
      if (i === current) status = 'current';
      else if (guardados.has(id) || i < current) status = 'complete';
      else status = 'upcoming';
      return { label, status };
    });
  });

  constructor() {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.declaracionesService.obtener(this.declaracionId).subscribe({
      next: (detalle) => {
        this.detalle.set(detalle);
        this.resultado.set(detalle.resultado);

        const regs = new Set<RegimenId>();
        if (detalle.ingresoResico) regs.add('resico');
        if (detalle.ingresoSueldos) regs.add('sueldos');
        if (detalle.ingresoActividadEmpresarial) regs.add('actividad');
        if (detalle.ingresoArrendamiento) regs.add('arrendamiento');
        this.regimenes.set(regs);
        this.regimenesConfirmados.set(regs.size > 0);

        const guardados = new Set<string>();
        if (regs.size > 0) guardados.add('regimenes');
        if (detalle.ingresoResico) guardados.add('resico');
        if (detalle.ingresoSueldos) guardados.add('sueldos');
        if (detalle.ingresoActividadEmpresarial) guardados.add('actividad');
        if (detalle.ingresoArrendamiento) guardados.add('arrendamiento');
        if (detalle.deduccionesPersonales.length > 0) guardados.add('deducciones');
        this.pasosGuardados.set(guardados);

        // Resume where the user left off: past every completed régimen, at 'revision'
        // once they're all captured, or at the first régimen still missing data.
        const ordenados = ORDEN_REGIMENES.filter((r) => regs.has(r));
        const primeroPendiente = ordenados.find((r) => !guardados.has(r));
        if (regs.size === 0) {
          this.stepIndex.set(0);
        } else if (primeroPendiente) {
          this.stepIndex.set(1 + ordenados.indexOf(primeroPendiente));
        } else {
          this.stepIndex.set(1 + ordenados.length + 1); // deducciones already covered -> revisión
        }

        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.notifications.error('No se pudo cargar la declaración.');
        this.router.navigateByUrl('/');
      },
    });
  }

  goToStep(index: number): void {
    if (index < 0 || index >= this.stepIds().length) return;
    this.stepIndex.set(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToStepId(id: StepId): void {
    const index = this.stepIds().indexOf(id);
    if (index >= 0) this.goToStep(index);
  }

  next(): void {
    this.goToStep(this.stepIndex() + 1);
  }

  back(): void {
    this.goToStep(this.stepIndex() - 1);
  }

  private marcarGuardado(id: string): void {
    this.pasosGuardados.update((set) => new Set(set).add(id));
    if (this.resultado()) {
      this.desactualizado.set(true);
    }
  }

  onRegimenesConfirmados(regs: Set<RegimenId>): void {
    this.regimenes.set(regs);
    this.regimenesConfirmados.set(true);
    this.marcarGuardado('regimenes');
    this.next();
  }

  onResicoGuardado(dto: IngresoResicoDto): void {
    this.detalle.update((d) => (d ? { ...d, ingresoResico: dto } : d));
    this.marcarGuardado('resico');
    this.next();
  }

  onSueldosGuardado(dto: IngresoSueldosDto): void {
    this.detalle.update((d) => (d ? { ...d, ingresoSueldos: dto } : d));
    this.marcarGuardado('sueldos');
    this.next();
  }

  onActividadGuardado(dto: IngresoActividadEmpresarialDto): void {
    this.detalle.update((d) => (d ? { ...d, ingresoActividadEmpresarial: dto } : d));
    this.marcarGuardado('actividad');
    this.next();
  }

  onArrendamientoGuardado(dto: IngresoArrendamientoDto): void {
    this.detalle.update((d) => (d ? { ...d, ingresoArrendamiento: dto } : d));
    this.marcarGuardado('arrendamiento');
    this.next();
  }

  onDeduccionesGuardadas(dtos: DeduccionPersonalDto[]): void {
    this.detalle.update((d) => (d ? { ...d, deduccionesPersonales: dtos } : d));
    this.marcarGuardado('deducciones');
    this.next();
  }

  onCalculado(resultado: ResultadoCalculoDto): void {
    this.resultado.set(resultado);
    this.desactualizado.set(false);
    this.detalle.update((d) => (d ? { ...d, estatus: 'Calculada', resultado } : d));
  }
}
