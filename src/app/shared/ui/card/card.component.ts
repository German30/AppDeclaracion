import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  styleUrl: './card.component.scss',
})
export class CardComponent {
  readonly padded = input(true);
  readonly interactive = input(false);

  @HostBinding('class.padded') get isPadded() {
    return this.padded();
  }

  @HostBinding('class.interactive') get isInteractive() {
    return this.interactive();
  }
}
