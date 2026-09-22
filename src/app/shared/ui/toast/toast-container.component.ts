import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/http/notification.service';
import { IconComponent, IconName } from '../icon/icon.component';

const ICONS: Record<string, IconName> = {
  success: 'check-circle',
  error: 'alert-circle',
  info: 'info',
};

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent {
  private readonly notifications = inject(NotificationService);
  readonly items = this.notifications.notificaciones;

  icon(tipo: string): IconName {
    return ICONS[tipo] ?? 'info';
  }

  dismiss(id: number): void {
    this.notifications.descartar(id);
  }
}
