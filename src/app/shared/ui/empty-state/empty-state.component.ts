import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state__icon"><app-icon [name]="icon()" [size]="26" [strokeWidth]="1.5" /></div>
    <h3 class="empty-state__title">{{ title() }}</h3>
    <p class="empty-state__description">{{ description() }}</p>
    <ng-content></ng-content>
  `,
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  readonly icon = input.required<IconName>();
  readonly title = input.required<string>();
  readonly description = input('');
}
