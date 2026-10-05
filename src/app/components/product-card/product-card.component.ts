import { Component, input, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonProgressBar } from '@ionic/angular';

import { Product } from '../../models/product.model';

/**
 * Tarjeta visual de un producto, usada en el dashboard de /productos en
 * lugar de una fila de tabla. Recibe el producto por "input()" (signal
 * input, API moderna de Angular) y calcula internamente el stock valorado
 * y el porcentaje de stock restante para la barra de progreso.
 */
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  imports: [CurrencyPipe, RouterLink, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonProgressBar],
})
export class ProductCardComponent {
  product = input.required<Product>();

  /** unidades * precio - descuento aplicable */
  valorStock = computed(() => {
    const p = this.product();
    const subtotal = p.stock * p.price;
    const descuentoAplicable = subtotal * (p.discountPercentage / 100);
    return subtotal - descuentoAplicable;
  });

  /** Nivel de stock normalizado (0-1) para la barra de progreso visual. */
  stockRatio = computed(() => Math.min(1, this.product().stock / 150));

  stockColor = computed(() => {
    const stock = this.product().stock;
    if (stock < 20) return 'danger';
    if (stock < 60) return 'warning';
    return 'success';
  });
}
