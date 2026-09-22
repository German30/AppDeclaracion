import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'button[appButton]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <span class="spinner" aria-hidden="true"></span>
    }
    <span class="label" [class.label--hidden]="loading()">
      <ng-content></ng-content>
    </span>
  `,
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly loading = input(false);
  readonly fullWidth = input(false);

  @HostBinding('class') get classes(): string {
    return `variant-${this.variant()} size-${this.size()} ${this.fullWidth() ? 'full-width' : ''}`;
  }

  @HostBinding('attr.disabled') get disabledAttr(): '' | null {
    return this.loading() ? '' : null;
  }

  @HostBinding('attr.aria-busy') get busy(): 'true' | null {
    return this.loading() ? 'true' : null;
  }
}
