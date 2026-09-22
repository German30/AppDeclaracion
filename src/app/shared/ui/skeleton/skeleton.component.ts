import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly radius = input('var(--radius-sm)');

  @HostBinding('style.width') get w() {
    return this.width();
  }
  @HostBinding('style.height') get h() {
    return this.height();
  }
  @HostBinding('style.borderRadius') get r() {
    return this.radius();
  }
}
