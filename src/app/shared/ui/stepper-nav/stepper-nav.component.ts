import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type StepStatus = 'complete' | 'current' | 'upcoming' | 'invalid';

export interface StepInfo {
  label: string;
  hint?: string;
  status: StepStatus;
}

@Component({
  selector: 'app-stepper-nav',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stepper-nav.component.html',
  styleUrl: './stepper-nav.component.scss',
})
export class StepperNavComponent {
  readonly steps = input.required<StepInfo[]>();
  readonly stepSelected = output<number>();

  select(index: number, status: StepStatus): void {
    if (status === 'upcoming') return;
    this.stepSelected.emit(index);
  }
}
