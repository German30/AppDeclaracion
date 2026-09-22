import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'check'
  | 'check-circle'
  | 'alert-triangle'
  | 'alert-circle'
  | 'info'
  | 'x'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'plus'
  | 'trash'
  | 'arrow-right'
  | 'arrow-left'
  | 'file-text'
  | 'calculator'
  | 'log-out'
  | 'user'
  | 'lock'
  | 'mail'
  | 'eye'
  | 'eye-off'
  | 'briefcase'
  | 'home'
  | 'building'
  | 'coins'
  | 'wallet'
  | 'shield-check'
  | 'clipboard-list'
  | 'edit';

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (name()) {
        @case ('check') {
          <path d="M20 6 9 17l-5-5" />
        }
        @case ('check-circle') {
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.5 2.5 5-5" />
        }
        @case ('alert-triangle') {
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        }
        @case ('alert-circle') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5" />
          <path d="M12 16.5h.01" />
        }
        @case ('info') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 7.5h.01" />
        }
        @case ('x') {
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        }
        @case ('chevron-right') {
          <path d="m9 6 6 6-6 6" />
        }
        @case ('chevron-left') {
          <path d="m15 6-6 6 6 6" />
        }
        @case ('chevron-down') {
          <path d="m6 9 6 6 6-6" />
        }
        @case ('plus') {
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        }
        @case ('trash') {
          <path d="M4 7h16" />
          <path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
          <path d="M9 7V4h6v3" />
        }
        @case ('arrow-right') {
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        }
        @case ('arrow-left') {
          <path d="M19 12H5" />
          <path d="m11 18-6-6 6-6" />
        }
        @case ('file-text') {
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        }
        @case ('calculator') {
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8" />
          <path d="M8 11h.01" />
          <path d="M12 11h.01" />
          <path d="M16 11h.01" />
          <path d="M8 15h.01" />
          <path d="M12 15h.01" />
          <path d="M16 15v3" />
          <path d="M8 19h.01" />
          <path d="M12 19h.01" />
        }
        @case ('log-out') {
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        }
        @case ('user') {
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="7.5" r="4.5" />
        }
        @case ('lock') {
          <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
          <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
        }
        @case ('mail') {
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        }
        @case ('eye') {
          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
          <circle cx="12" cy="12" r="3" />
        }
        @case ('eye-off') {
          <path d="M3 3l18 18" />
          <path d="M10.6 5.2A9.9 9.9 0 0 1 12 5c6 0 9.5 7 9.5 7a15.6 15.6 0 0 1-3.4 4.3" />
          <path d="M6.5 6.8C4 8.4 2.5 12 2.5 12s3.5 7 9.5 7a9.8 9.8 0 0 0 3.4-.6" />
          <path d="M9.5 10.5a3 3 0 0 0 4 4" />
        }
        @case ('briefcase') {
          <rect x="3" y="7.5" width="18" height="12" rx="2" />
          <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
          <path d="M3 12.5h18" />
        }
        @case ('home') {
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
        }
        @case ('building') {
          <rect x="5" y="3" width="14" height="18" rx="1" />
          <path d="M9 8h.01M12 8h.01M15 8h.01M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" />
        }
        @case ('coins') {
          <circle cx="9" cy="9" r="5.5" />
          <path d="M14.5 12.8a5.5 5.5 0 1 0-6.7 6.7" />
          <circle cx="15" cy="15" r="5.5" />
        }
        @case ('wallet') {
          <path d="M3 7.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
          <rect x="3" y="8.5" width="18" height="11" rx="2" />
          <path d="M16 14h2" />
        }
        @case ('shield-check') {
          <path d="M12 3 4.5 6v6c0 4.5 3 7.5 7.5 9 4.5-1.5 7.5-4.5 7.5-9V6Z" />
          <path d="m8.5 12.5 2.5 2.5 4.5-5" />
        }
        @case ('clipboard-list') {
          <rect x="6" y="4" width="12" height="17" rx="2" />
          <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
          <path d="M9 11h6" />
          <path d="M9 15h6" />
          <path d="M9 19h3" />
        }
        @case ('edit') {
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        }
      }
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 0;
        flex-shrink: 0;
      }
    `,
  ],
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(18);
  readonly strokeWidth = input(1.75);
}
