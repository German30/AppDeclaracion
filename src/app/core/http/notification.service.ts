import { Injectable, signal } from '@angular/core';

export type NotificationTipo = 'success' | 'error' | 'info';

export interface Notificacion {
  id: number;
  tipo: NotificationTipo;
  mensaje: string;
}

let nextId = 1;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notificaciones = signal<Notificacion[]>([]);
  readonly notificaciones = this._notificaciones.asReadonly();

  mostrar(mensaje: string, tipo: NotificationTipo = 'info', duracionMs = 5000): void {
    const id = nextId++;
    this._notificaciones.update((lista) => [...lista, { id, tipo, mensaje }]);
    if (duracionMs > 0) {
      setTimeout(() => this.descartar(id), duracionMs);
    }
  }

  exito(mensaje: string): void {
    this.mostrar(mensaje, 'success');
  }

  error(mensaje: string): void {
    this.mostrar(mensaje, 'error', 7000);
  }

  descartar(id: number): void {
    this._notificaciones.update((lista) => lista.filter((n) => n.id !== id));
  }
}
