import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/angular';

import { Product, ProductsResponse } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  imports: [
    CurrencyPipe,
    DecimalPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    ProductCardComponent,
    ThemeToggleComponent,
  ],
})
export class ProductosPage implements OnInit {
  private productService = inject(ProductService);

  // Usamos signals en lugar de propiedades planas: así la vista se
  // actualiza de forma fiable al llegar la respuesta de la API,
  // sin depender de que zone.js parchee el XHR/fetch subyacente.
  products = signal<Product[]>([]);
  total = signal(0);
  loading = signal(false);
  error = signal('');

  // ===== DASHBOARD: estadísticas resumen de la página actual =====
  // En vez de solo listar filas, calculamos indicadores agregados para dar
  // una vista tipo "dashboard" sobre los productos mostrados.
  valorStockTotalPagina = computed(() =>
    this.products().reduce((acc, p) => acc + this.valorStock(p), 0),
  );

  valoracionMedia = computed(() => {
    const items = this.products();
    if (items.length === 0) return 0;
    const suma = items.reduce((acc, p) => acc + p.rating, 0);
    return suma / items.length;
  });
  // ===== FIN DASHBOARD =====

  // ===== PAGINACIÓN =====
  // La API de dummyjson soporta paginación real con los parámetros
  // "limit" (productos por página) y "skip" (cuántos se saltan).
  // pageSize = tamaño fijo de página; page = página actual (empieza en 1);
  // totalPages se recalcula solo cuando cambia "total" (nº real de productos).
  readonly pageSize = 10;
  page = signal(1);
  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  // ===== FIN PAGINACIÓN (sigue en loadProducts() y en los métodos de abajo) =====

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set('');

    // PAGINACIÓN: calculamos cuántos productos saltarnos según la página
    // actual y se lo pasamos al servicio junto con el tamaño de página.
    const skip = (this.page() - 1) * this.pageSize;

    this.productService.getProducts(this.pageSize, skip).subscribe({
      next: (response: ProductsResponse) => {
        this.products.set(response.products);
        this.total.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.error.set('No se han podido cargar los productos.');
        this.loading.set(false);
      },
    });
  }

  // ===== PAGINACIÓN: navegación entre páginas =====
  // goToPage valida los límites (no ir antes de la 1 ni después de la última)
  // y recarga los productos de la nueva página. previousPage/nextPage son
  // los helpers que usan los botones "‹ Anterior" / "Siguiente ›" del HTML.
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.page.set(page);
    this.loadProducts();
  }

  previousPage(): void {
    this.goToPage(this.page() - 1);
  }

  nextPage(): void {
    this.goToPage(this.page() + 1);
  }
  // ===== FIN PAGINACIÓN =====

  /**
   * Calcula el valor total del stock de un producto aplicando su descuento:
   * unidades * precio - descuento aplicable (unidades * precio * % descuento).
   */
  valorStock(product: Product): number {
    const subtotal = product.stock * product.price;
    const descuentoAplicable = subtotal * (product.discountPercentage / 100);
    return subtotal - descuentoAplicable;
  }
}
