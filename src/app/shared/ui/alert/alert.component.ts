import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon.component';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const ICONS: Record<AlertTone, IconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
};

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-icon class="alert__icon" [name]="icon" [size]="18" />
    <div class="alert__body">
      @if (title()) {
        <p class="alert__title">{{ title() }}</p>
      }
      <div class="alert__content"><ng-content></ng-content></div>
    </div>
  `,
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  readonly tone = input<AlertTone>('info');
  readonly title = input<string>('');

  get icon(): IconName {
    return ICONS[this.tone()];
  }

  @HostBinding('class') get classes(): string {
    return `tone-${this.tone()}`;
  }

  @HostBinding('attr.role') readonly role = 'status';
}
