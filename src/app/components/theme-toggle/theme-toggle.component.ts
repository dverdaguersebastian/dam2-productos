import { Component, inject } from '@angular/core';
import { IonButton } from '@ionic/angular';

import { ThemeService } from '../../services/theme.service';

/**
 * Botón de modo oscuro reutilizable: se coloca en la toolbar de cada página
 * (slot="end") y alterna el tema llamando a ThemeService.toggle().
 */
@Component({
  selector: 'app-theme-toggle',
  template: `
    <ion-button (click)="theme.toggle()" fill="clear" aria-label="Alternar modo oscuro">
      {{ theme.isDark() ? '☀️' : '🌙' }}
    </ion-button>
  `,
  imports: [IonButton],
})
export class ThemeToggleComponent {
  protected theme = inject(ThemeService);
}
