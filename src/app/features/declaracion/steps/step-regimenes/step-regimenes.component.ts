import { ChangeDetectionStrategy, Component, OnInit, input, output, signal } from '@angular/core';
import { REGIMEN_INFO, RegimenId } from '../../../../core/models/declaracion.models';
import { IconComponent, IconName } from '../../../../shared/ui/icon/icon.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

const ORDEN: RegimenId[] = ['resico', 'sueldos', 'actividad', 'arrendamiento'];
const ICONOS: Record<RegimenId, IconName> = {
  resico: 'coins',
  sueldos: 'wallet',
  actividad: 'briefcase',
  arrendamiento: 'home',
};

@Component({
  selector: 'app-step-regimenes',
  standalone: true,
  imports: [IconComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-regimenes.component.html',
  styleUrls: ['../step-shared.scss', './step-regimenes.component.scss'],
})
export class StepRegimenesComponent implements OnInit {
  readonly seleccionInicial = input<Set<RegimenId>>(new Set());
  readonly confirmado = output<Set<RegimenId>>();

  readonly opciones = ORDEN;
  readonly info = REGIMEN_INFO;
  readonly seleccion = signal<Set<RegimenId>>(new Set());

  ngOnInit(): void {
    this.seleccion.set(new Set(this.seleccionInicial()));
  }

  icono(id: RegimenId): IconName {
    return ICONOS[id];
  }

  estaSeleccionado(id: RegimenId): boolean {
    return this.seleccion().has(id);
  }

  alternar(id: RegimenId): void {
    this.seleccion.update((set) => {
      const nuevo = new Set(set);
      if (nuevo.has(id)) nuevo.delete(id);
      else nuevo.add(id);
      return nuevo;
    });
  }

  continuar(): void {
    if (this.seleccion().size === 0) return;
    this.confirmado.emit(this.seleccion());
  }
}
