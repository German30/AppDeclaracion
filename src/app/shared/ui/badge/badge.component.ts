import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('neutral');

  @HostBinding('class') get classes(): string {
    return `tone-${this.tone()}`;
  }
}
